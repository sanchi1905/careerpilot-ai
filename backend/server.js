require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const Application = require('./models/Application');
const requireAuth = require('./middleware/requireAuth');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// ─── MongoDB Connection ────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn('\n⚠️  MONGO_URI not set in .env — running with in-memory fallback data.\n');
}

// ─── In-Memory Fallback (used only if MONGO_URI is not set) ──────────────────
let useDB = false;
let inMemoryApps = [
  { id: '1', company: 'Google', role: 'Software Engineering Intern', location: 'Remote', status: 'applied', appliedDate: '2026-06-22', notes: 'Applied via company portal', resumeScore: 85 },
  { id: '2', company: 'Stripe', role: 'Frontend Engineer', location: 'San Francisco, CA', status: 'applied', appliedDate: '2026-06-24', notes: 'Referred by alumni', resumeScore: 78 },
  { id: '3', company: 'Meta', role: 'Product Engineering Intern', location: 'Menlo Park, CA', status: 'interviewing', appliedDate: '2026-06-15', notes: 'Technical Round 2 scheduled', resumeScore: 90 },
  { id: '4', company: 'Netflix', role: 'UI Developer', location: 'Los Gatos, CA', status: 'interviewing', appliedDate: '2026-06-10', notes: 'System Design round scheduled', resumeScore: 82 },
  { id: '5', company: 'Vercel', role: 'Developer Advocate', location: 'Remote', status: 'offer', appliedDate: '2026-06-01', notes: 'Offer letter received – deadline July 5', resumeScore: 95 },
  { id: '6', company: 'Notion', role: 'Full Stack Engineer', location: 'Remote', status: 'rejected', appliedDate: '2026-06-05', notes: 'Position filled', resumeScore: 72 },
];
let nextId = 7;

// ─── Helper ───────────────────────────────────────────────────────────────────
const validateApplication = (body) => {
  const { company, role, location, status } = body;
  if (!company || typeof company !== 'string' || !company.trim()) return 'company is required';
  if (!role || typeof role !== 'string' || !role.trim()) return 'role is required';
  if (!location || typeof location !== 'string' || !location.trim()) return 'location is required';
  const validStatuses = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];
  if (status && !validStatuses.includes(status)) return `status must be one of: ${validStatuses.join(', ')}`;
  return null;
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'CareerPilot API is running',
    database: useDB ? 'MongoDB Atlas (Mongoose)' : 'In-Memory Fallback',
    timestamp: new Date().toISOString(),
  });
});

// ─── Auth: OAuth callback handler (used as a frontend redirect target) ────────
// The frontend /auth/callback page reads the token from URL and stores it

// ─── Protected Application Routes (require JWT) ─────────────────────────────
// GET /api/applications — list all (with optional status filter)
app.get('/api/applications', requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    if (useDB) {
      const filter = status ? { status } : {};
      const data = await Application.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ count: data.length, data });
    }
    let result = inMemoryApps;
    if (status) result = inMemoryApps.filter((a) => a.status === status);
    res.status(200).json({ count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/search?q=
app.get('/api/applications/search', requireAuth, async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });
    if (useDB) {
      const data = await Application.find({
        $or: [
          { company: { $regex: q, $options: 'i' } },
          { role: { $regex: q, $options: 'i' } },
          { location: { $regex: q, $options: 'i' } },
        ],
      });
      return res.status(200).json({ count: data.length, data });
    }
    const results = inMemoryApps.filter(
      (a) => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q) || a.location.toLowerCase().includes(q)
    );
    res.status(200).json({ count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/stats
app.get('/api/applications/stats', requireAuth, async (req, res) => {
  try {
    if (useDB) {
      const all = await Application.find({});
      const total = all.length;
      const applied = all.filter((a) => a.status === 'applied').length;
      const interviewing = all.filter((a) => a.status === 'interviewing').length;
      const offers = all.filter((a) => a.status === 'offer').length;
      const rejected = all.filter((a) => a.status === 'rejected').length;
      const avgScore = total > 0 ? Math.round(all.reduce((s, a) => s + (a.resumeScore || 0), 0) / total) : 0;
      return res.status(200).json({ total, applied, interviewing, offers, rejected, avgResumeScore: avgScore });
    }
    const total = inMemoryApps.length;
    const applied = inMemoryApps.filter((a) => a.status === 'applied').length;
    const interviewing = inMemoryApps.filter((a) => a.status === 'interviewing').length;
    const offers = inMemoryApps.filter((a) => a.status === 'offer').length;
    const rejected = inMemoryApps.filter((a) => a.status === 'rejected').length;
    const avgScore = total > 0 ? Math.round(inMemoryApps.reduce((s, a) => s + (a.resumeScore || 0), 0) / total) : 0;
    res.status(200).json({ total, applied, interviewing, offers, rejected, avgResumeScore: avgScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/:id
app.get('/api/applications/:id', requireAuth, async (req, res) => {
  try {
    if (useDB) {
      const item = await Application.findById(req.params.id);
      if (!item) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
      return res.status(200).json({ data: item });
    }
    const item = inMemoryApps.find((a) => a.id === req.params.id);
    if (!item) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
    res.status(200).json({ data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications
app.post('/api/applications', requireAuth, async (req, res) => {
  try {
    const validationError = validateApplication(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { company, role, location, status = 'applied', notes = '', resumeScore = 0 } = req.body;

    if (useDB) {
      const newApp = await Application.create({
        company: company.trim(), role: role.trim(), location: location.trim(),
        status, notes, resumeScore,
        appliedDate: new Date().toISOString().split('T')[0],
      });
      return res.status(201).json({ message: 'Application created successfully', data: newApp });
    }

    const newApp = {
      id: String(nextId++), company: company.trim(), role: role.trim(), location: location.trim(),
      status, appliedDate: new Date().toISOString().split('T')[0], notes, resumeScore,
    };
    inMemoryApps.push(newApp);
    res.status(201).json({ message: 'Application created successfully', data: newApp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/applications/:id
app.put('/api/applications/:id', requireAuth, async (req, res) => {
  try {
    const validationError = validateApplication(req.body);
    if (validationError) return res.status(400).json({ error: validationError });

    const { company, role, location, status, notes, resumeScore } = req.body;

    if (useDB) {
      const updated = await Application.findByIdAndUpdate(
        req.params.id,
        { company: company.trim(), role: role.trim(), location: location.trim(), status, notes, resumeScore },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
      return res.status(200).json({ message: 'Application updated successfully', data: updated });
    }

    const idx = inMemoryApps.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
    inMemoryApps[idx] = { ...inMemoryApps[idx], company: company.trim(), role: role.trim(), location: location.trim(), status: status || inMemoryApps[idx].status, notes: notes !== undefined ? notes : inMemoryApps[idx].notes, resumeScore: resumeScore !== undefined ? resumeScore : inMemoryApps[idx].resumeScore };
    res.status(200).json({ message: 'Application updated successfully', data: inMemoryApps[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/applications/:id
app.patch('/api/applications/:id', requireAuth, async (req, res) => {
  try {
    if (useDB) {
      const { status } = req.body;
      if (status) {
        const validStatuses = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];
        if (!validStatuses.includes(status)) return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
      }
      const updated = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
      return res.status(200).json({ message: 'Application patched successfully', data: updated });
    }

    const idx = inMemoryApps.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
    const { status } = req.body;
    if (status) {
      const validStatuses = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];
      if (!validStatuses.includes(status)) return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
      inMemoryApps[idx].status = status;
    }
    Object.keys(req.body).forEach((key) => { if (key !== 'id') inMemoryApps[idx][key] = req.body[key]; });
    res.status(200).json({ message: 'Application patched successfully', data: inMemoryApps[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/applications/:id
app.delete('/api/applications/:id', requireAuth, async (req, res) => {
  try {
    if (useDB) {
      const deleted = await Application.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
      return res.status(204).send();
    }
    const idx = inMemoryApps.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
    inMemoryApps.splice(idx, 1);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      useDB = true;
      console.log('✅ Connected to MongoDB Atlas via Mongoose');
    } catch (err) {
      console.warn('⚠️  MongoDB connection failed — falling back to in-memory data:', err.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 CareerPilot API running on http://localhost:${PORT}`);
    console.log(`   Database: ${useDB ? 'MongoDB Atlas (Mongoose)' : 'In-Memory Fallback'}`);
    console.log(`   Frontend origin allowed: ${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}`);
    console.log('\nAvailable endpoints:');
    console.log(`   GET    /api/health`);
    console.log(`   POST   /api/auth/register`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   GET    /api/auth/me          (🔒 JWT required)`);
    console.log(`   POST   /api/auth/logout`);
    console.log(`   GET    /api/auth/github       (OAuth)`);
    console.log(`   GET    /api/auth/github/callback`);
    console.log(`   GET    /api/applications      (🔒 JWT required)`);
    console.log(`   GET    /api/applications/search?q= (🔒 JWT required)`);
    console.log(`   GET    /api/applications/stats     (🔒 JWT required)`);
    console.log(`   GET    /api/applications/:id  (🔒 JWT required)`);
    console.log(`   POST   /api/applications      (🔒 JWT required)`);
    console.log(`   PUT    /api/applications/:id  (🔒 JWT required)`);
    console.log(`   PATCH  /api/applications/:id  (🔒 JWT required)`);
    console.log(`   DELETE /api/applications/:id  (🔒 JWT required)`);
  });
};

startServer();
