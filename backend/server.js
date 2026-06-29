require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─── In-Memory Data Store ─────────────────────────────────────────────────────
let applications = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineering Intern',
    location: 'Remote',
    status: 'applied',
    appliedDate: '2026-06-22',
    notes: 'Applied via company portal',
    resumeScore: 85,
  },
  {
    id: '2',
    company: 'Stripe',
    role: 'Frontend Engineer',
    location: 'San Francisco, CA',
    status: 'applied',
    appliedDate: '2026-06-24',
    notes: 'Referred by alumni',
    resumeScore: 78,
  },
  {
    id: '3',
    company: 'Meta',
    role: 'Product Engineering Intern',
    location: 'Menlo Park, CA',
    status: 'interviewing',
    appliedDate: '2026-06-15',
    notes: 'Technical Round 2 scheduled',
    resumeScore: 90,
  },
  {
    id: '4',
    company: 'Netflix',
    role: 'UI Developer',
    location: 'Los Gatos, CA',
    status: 'interviewing',
    appliedDate: '2026-06-10',
    notes: 'System Design round scheduled',
    resumeScore: 82,
  },
  {
    id: '5',
    company: 'Vercel',
    role: 'Developer Advocate',
    location: 'Remote',
    status: 'offer',
    appliedDate: '2026-06-01',
    notes: 'Offer letter received – deadline July 5',
    resumeScore: 95,
  },
  {
    id: '6',
    company: 'Notion',
    role: 'Full Stack Engineer',
    location: 'Remote',
    status: 'rejected',
    appliedDate: '2026-06-05',
    notes: 'Position filled',
    resumeScore: 72,
  },
];

let nextId = 7;

// ─── Helper ───────────────────────────────────────────────────────────────────
const validateApplication = (body) => {
  const { company, role, location, status } = body;
  if (!company || typeof company !== 'string' || !company.trim()) {
    return 'company is required';
  }
  if (!role || typeof role !== 'string' || !role.trim()) {
    return 'role is required';
  }
  if (!location || typeof location !== 'string' || !location.trim()) {
    return 'location is required';
  }
  const validStatuses = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];
  if (status && !validStatuses.includes(status)) {
    return `status must be one of: ${validStatuses.join(', ')}`;
  }
  return null;
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CareerPilot API is running', timestamp: new Date().toISOString() });
});

// GET /api/applications — list all applications (with optional status filter)
app.get('/api/applications', (req, res) => {
  const { status } = req.query;
  let result = applications;
  if (status) {
    result = applications.filter((a) => a.status === status);
  }
  res.status(200).json({
    count: result.length,
    data: result,
  });
});

// GET /api/applications/search?q= — search applications by company or role
app.get('/api/applications/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  const results = applications.filter(
    (a) =>
      a.company.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
  );
  res.status(200).json({ count: results.length, data: results });
});

// GET /api/applications/stats — dashboard stats
app.get('/api/applications/stats', (req, res) => {
  const total = applications.length;
  const applied = applications.filter((a) => a.status === 'applied').length;
  const interviewing = applications.filter((a) => a.status === 'interviewing').length;
  const offers = applications.filter((a) => a.status === 'offer').length;
  const rejected = applications.filter((a) => a.status === 'rejected').length;
  const avgScore =
    applications.length > 0
      ? Math.round(applications.reduce((sum, a) => sum + (a.resumeScore || 0), 0) / applications.length)
      : 0;

  res.status(200).json({
    total,
    applied,
    interviewing,
    offers,
    rejected,
    avgResumeScore: avgScore,
  });
});

// GET /api/applications/:id — get a single application
app.get('/api/applications/:id', (req, res) => {
  const app_item = applications.find((a) => a.id === req.params.id);
  if (!app_item) {
    return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
  }
  res.status(200).json({ data: app_item });
});

// POST /api/applications — create a new application
app.post('/api/applications', (req, res) => {
  const validationError = validateApplication(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { company, role, location, status = 'applied', notes = '', resumeScore = 0 } = req.body;
  const newApp = {
    id: String(nextId++),
    company: company.trim(),
    role: role.trim(),
    location: location.trim(),
    status,
    appliedDate: new Date().toISOString().split('T')[0],
    notes,
    resumeScore,
  };

  applications.push(newApp);
  res.status(201).json({ message: 'Application created successfully', data: newApp });
});

// PUT /api/applications/:id — fully update an application
app.put('/api/applications/:id', (req, res) => {
  const idx = applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
  }

  const validationError = validateApplication(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { company, role, location, status, notes, resumeScore } = req.body;
  applications[idx] = {
    ...applications[idx],
    company: company.trim(),
    role: role.trim(),
    location: location.trim(),
    status: status || applications[idx].status,
    notes: notes !== undefined ? notes : applications[idx].notes,
    resumeScore: resumeScore !== undefined ? resumeScore : applications[idx].resumeScore,
  };

  res.status(200).json({ message: 'Application updated successfully', data: applications[idx] });
});

// PATCH /api/applications/:id — partially update (e.g., just status)
app.patch('/api/applications/:id', (req, res) => {
  const idx = applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
  }

  const { status } = req.body;
  if (status) {
    const validStatuses = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    }
    applications[idx].status = status;
  }

  Object.keys(req.body).forEach((key) => {
    if (key !== 'id') {
      applications[idx][key] = req.body[key];
    }
  });

  res.status(200).json({ message: 'Application patched successfully', data: applications[idx] });
});

// DELETE /api/applications/:id — delete an application
app.delete('/api/applications/:id', (req, res) => {
  const idx = applications.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: `Application with id "${req.params.id}" not found` });
  }

  applications.splice(idx, 1);
  res.status(204).send();
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
app.listen(PORT, () => {
  console.log(`\n🚀 CareerPilot API running on http://localhost:${PORT}`);
  console.log(`   Frontend origin allowed: ${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}`);
  console.log('\nAvailable endpoints:');
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/applications`);
  console.log(`   GET    /api/applications/search?q=`);
  console.log(`   GET    /api/applications/stats`);
  console.log(`   GET    /api/applications/:id`);
  console.log(`   POST   /api/applications`);
  console.log(`   PUT    /api/applications/:id`);
  console.log(`   PATCH  /api/applications/:id`);
  console.log(`   DELETE /api/applications/:id`);
});
