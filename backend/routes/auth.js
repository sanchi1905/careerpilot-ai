const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const router = express.Router();

// ─── Lazy-load User model (only if Mongoose is connected) ────────────────────
// We use a helper to get the model so we don't crash if mongoose isn't ready
let User = null;
const getUser = () => {
  if (!User) {
    try { User = require('../models/User'); } catch (_) {}
  }
  return User;
};

// ─── In-Memory User Store (fallback when no MongoDB) ─────────────────────────
const inMemoryUsers = [];
let nextUserId = 1;

// ─── JWT Helpers ──────────────────────────────────────────────────────────────
const JWT_SECRET = () => process.env.JWT_SECRET || 'dev_secret_change_me';
const FRONTEND_ORIGIN = () => process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

function signToken(user) {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, name: user.name },
    JWT_SECRET(),
    { expiresIn: '7d' }
  );
}

// ─── Rate Limiter (auth endpoints only) ──────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Zod Schemas ──────────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Passport GitHub Strategy ─────────────────────────────────────────────────
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `http://localhost:${process.env.PORT || 5000}/api/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const UserModel = getUser();
          const email = (profile.emails && profile.emails[0]?.value) || `github_${profile.id}@noemail.com`;
          const name = profile.displayName || profile.username || 'GitHub User';

          if (UserModel) {
            // MongoDB path
            let user = await UserModel.findOne({ githubId: profile.id });
            if (!user) {
              user = await UserModel.findOne({ email });
            }
            if (!user) {
              user = await UserModel.create({ name, email, githubId: String(profile.id), password: null });
            } else if (!user.githubId) {
              user.githubId = String(profile.id);
              await user.save();
            }
            return done(null, user);
          } else {
            // In-memory path
            let user = inMemoryUsers.find(u => u.githubId === String(profile.id));
            if (!user) user = inMemoryUsers.find(u => u.email === email);
            if (!user) {
              user = { id: String(nextUserId++), name, email, githubId: String(profile.id), password: null };
              inMemoryUsers.push(user);
            }
            return done(null, user);
          }
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn('⚠️  GitHub OAuth not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET missing in .env)');
}

passport.serializeUser((user, done) => done(null, user._id || user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const UserModel = getUser();
    if (UserModel) {
      const user = await UserModel.findById(id);
      done(null, user);
    } else {
      const user = inMemoryUsers.find(u => u.id === id);
      done(null, user || null);
    }
  } catch (err) { done(err); }
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  try {
    // Validate input
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message || 'Invalid input';
      return res.status(400).json({ error: message });
    }
    const { name, email, password } = parsed.data;

    const UserModel = getUser();

    if (UserModel) {
      // MongoDB path
      const existing = await UserModel.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

      const hashed = await bcrypt.hash(password, 12);
      const user = await UserModel.create({ name, email: email.toLowerCase(), password: hashed });

      const token = signToken(user);
      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    } else {
      // In-memory path
      const existing = inMemoryUsers.find(u => u.email === email.toLowerCase());
      if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

      const hashed = await bcrypt.hash(password, 12);
      const user = { id: String(nextUserId++), name, email: email.toLowerCase(), password: hashed, githubId: null };
      inMemoryUsers.push(user);

      const token = signToken(user);
      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }
  } catch (err) {
    console.error('[POST /auth/register]', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.errors[0]?.message || 'Invalid input';
      return res.status(400).json({ error: message });
    }
    const { email, password } = parsed.data;

    const UserModel = getUser();

    let user;
    if (UserModel) {
      user = await UserModel.findOne({ email: email.toLowerCase() });
    } else {
      user = inMemoryUsers.find(u => u.email === email.toLowerCase());
    }

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user);
    return res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id || user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('[POST /auth/login]', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const requireAuth = require('../middleware/requireAuth');
router.get('/me', requireAuth, async (req, res) => {
  try {
    const UserModel = getUser();
    let user;
    if (UserModel) {
      user = await UserModel.findById(req.user.id).select('-password');
    } else {
      const found = inMemoryUsers.find(u => u.id === req.user.id);
      if (found) user = { id: found.id, name: found.name, email: found.email };
    }
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.status(200).json({ user });
  } catch (err) {
    console.error('[GET /auth/me]', err);
    res.status(500).json({ error: 'Could not fetch user.' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// JWT is stateless — actual logout happens on the client (clear localStorage)
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully.' });
});

// ─── GET /api/auth/github ─────────────────────────────────────────────────────
router.get('/github', (req, res, next) => {
  if (!process.env.GITHUB_CLIENT_ID) {
    return res.status(501).json({ error: 'GitHub OAuth is not configured on this server.' });
  }
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

// ─── GET /api/auth/github/callback ────────────────────────────────────────────
router.get(
  '/github/callback',
  (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID) {
      return res.redirect(`${FRONTEND_ORIGIN()}/login?error=oauth_not_configured`);
    }
    passport.authenticate('github', { session: false, failureRedirect: `${FRONTEND_ORIGIN()}/login?error=oauth_failed` })(req, res, next);
  },
  (req, res) => {
    const token = signToken(req.user);
    // Redirect to frontend with token in query (frontend stores it)
    res.redirect(`${FRONTEND_ORIGIN()}/auth/callback?token=${token}`);
  }
);

module.exports = router;
