import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/ui/Loader';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CheckCircle, Clock, FileText, Plus, Search, X, Pencil, Trash2, RefreshCw, Sparkles, Bot } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const STATUS_COLORS = {
  applied: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  interviewing: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  offer: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
  withdrawn: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const KANBAN_COLUMNS = ['applied', 'interviewing', 'offer'];

const EMPTY_FORM = {
  company: '',
  role: '',
  location: '',
  status: 'applied',
  notes: '',
  resumeScore: '',
};

export default function Dashboard() {
  const { addToast } = useToast();
  const { token } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // AI Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [activeAiApp, setActiveAiApp] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── AI Prep ──────────────────────────────────────────────────────────────────
  const handleAiPrep = async (app) => {
    setActiveAiApp(app);
    setAiData(null);
    setShowAiModal(true);
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/prep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ company: app.company, role: app.role }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setAiData(json);
    } catch (err) {
      addToast(`AI Prep failed: ${err.message}`, 'error');
      setShowAiModal(false);
    } finally {
      setAiLoading(false);
    }
  };

  // ── Fetch All Applications ─────────────────────────────────────────────────
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setApplications(json.data || []);
    } catch (err) {
      addToast(`Failed to load applications: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ── Fetch Stats ────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/applications/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setStats(json);
    } catch (err) {
      addToast(`Failed to load stats: ${err.message}`, 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [addToast]);

  // ── Initial Load ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      fetchApplications();
      fetchStats();
    }
  }, [fetchApplications, fetchStats, token]);

  // ── Search ─────────────────────────────────────────────────────────────────
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/applications/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const json = await res.json();
      setSearchResults(json.data || []);
      addToast(`Found ${json.count} result(s) for "${searchQuery}"`, 'info');
    } catch (err) {
      addToast(`Search error: ${err.message}`, 'error');
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  // ── Open / Close Modal ─────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingApp(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      company: app.company,
      role: app.role,
      location: app.location,
      status: app.status,
      notes: app.notes || '',
      resumeScore: app.resumeScore ?? '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingApp(null);
    setFormData(EMPTY_FORM);
  };

  // ── Submit Form (Create / Update) ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      resumeScore: formData.resumeScore !== '' ? Number(formData.resumeScore) : 0,
    };

    try {
      let res;
      if (editingApp) {
        res = await fetch(`${API_BASE}/applications/${editingApp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      addToast(
        editingApp ? 'Application updated successfully!' : 'Application added successfully!',
        'success'
      );
      closeModal();
      fetchApplications();
      fetchStats();
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 204 && !res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      addToast('Application deleted.', 'success');
      fetchApplications();
      fetchStats();
    } catch (err) {
      addToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Derived Data ────────────────────────────────────────────────────────────
  const displayList = searchResults !== null ? searchResults : applications;
  const statItems = stats
    ? [
        { title: 'Total Applications', value: String(stats.total), icon: Briefcase, color: 'text-indigo-400' },
        { title: 'Interviews Scheduled', value: String(stats.interviewing), icon: Clock, color: 'text-amber-400' },
        { title: 'Offers Received', value: String(stats.offers), icon: CheckCircle, color: 'text-emerald-400' },
        { title: 'Avg Resume Score', value: `${stats.avgResumeScore}%`, icon: FileText, color: 'text-purple-400' },
      ]
    : [];

  const kanbanColumns = KANBAN_COLUMNS.map((status) => ({
    title: status.charAt(0).toUpperCase() + status.slice(1),
    status,
    items: displayList.filter((a) => a.status === status),
  }));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen cp-page">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-cp-border pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold cp-text-primary">Application Dashboard</h1>
            <p className="cp-text-secondary text-sm mt-1">
              Track and manage your placement interviews in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live API
            </span>
            <button
              onClick={() => { fetchApplications(); fetchStats(); }}
              className="p-2 rounded-lg cp-card hover:border-indigo-500/30 transition-colors cp-text-secondary hover:cp-text-primary"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              id="add-application-btn"
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="cp-card p-6">
                  <Loader variant="skeleton" lines={2} />
                </div>
              ))
            : statItems.map((stat, idx) => (
                <div key={idx} className="cp-card p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm cp-text-secondary font-medium">{stat.title}</span>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <h2 className="text-3xl font-bold cp-text-primary mt-4">{stat.value}</h2>
                </div>
              ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, or location…"
              className="block w-full cp-bg-surface border border-cp-border rounded-xl pl-10 pr-4 py-2.5 text-sm cp-text-primary placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <button
            id="search-btn"
            type="submit"
            disabled={searching}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
          >
            {searching ? <Loader size="sm" /> : 'Search'}
          </button>
          {searchResults !== null && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-3 py-2 cp-card rounded-xl text-sm cp-text-secondary hover:cp-text-primary transition-colors flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </form>

        {/* Kanban Board / Loading / Empty */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader size="xl" label="Fetching applications from API…" />
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-20 cp-text-secondary">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No applications found</p>
            <p className="text-sm mt-1">
              {searchResults !== null ? 'Try a different search term.' : 'Click "Add Application" to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {kanbanColumns.map((col) => (
              <div key={col.status} className="cp-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold cp-text-primary flex items-center space-x-2">
                    <span>{col.title}</span>
                    <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full cp-text-secondary">
                      {col.items.length}
                    </span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {col.items.length === 0 && (
                    <p className="text-xs cp-text-secondary text-center py-4 opacity-60">No applications here</p>
                  )}
                  {col.items.map((item) => (
                    <div
                      key={item.id}
                      className="cp-card p-5 hover:border-indigo-500/30 transition-colors duration-200"
                      style={{ borderRadius: '0.75rem' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-indigo-400 font-semibold">{item.company}</span>
                          <h4 className="font-bold cp-text-primary text-sm mt-1 truncate">{item.role}</h4>
                          <p className="cp-text-secondary text-xs mt-1">{item.location}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleAiPrep(item)}
                            className="p-1.5 rounded-lg hover:bg-violet-500/10 text-slate-500 hover:text-violet-400 transition-colors"
                            title="AI Interview Prep"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === item.id ? (
                              <Loader size="sm" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-cp-border flex items-center justify-between text-[11px]">
                        <span className={`px-2 py-0.5 rounded-full border font-semibold text-[10px] ${STATUS_COLORS[item.status]}`}>
                          {item.status}
                        </span>
                        {item.resumeScore > 0 && (
                          <span className="cp-text-secondary">Score: {item.resumeScore}%</span>
                        )}
                      </div>
                      {item.notes && (
                        <p className="mt-2 text-[11px] cp-text-secondary italic line-clamp-2">{item.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejected / Withdrawn section */}
        {!loading && displayList.some((a) => ['rejected', 'withdrawn'].includes(a.status)) && (
          <div className="mt-8 cp-card p-6">
            <h3 className="font-bold cp-text-primary mb-4">Other Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayList
                .filter((a) => ['rejected', 'withdrawn'].includes(a.status))
                .map((item) => (
                  <div key={item.id} className="cp-card p-4 flex items-center justify-between gap-3" style={{ borderRadius: '0.75rem' }}>
                    <div>
                      <span className="text-xs cp-text-secondary font-semibold">{item.company}</span>
                      <p className="text-sm cp-text-primary font-bold">{item.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full border font-semibold text-[10px] ${STATUS_COLORS[item.status]}`}>
                        {item.status}
                      </span>
                      <button onClick={() => handleAiPrep(item)} className="p-1.5 rounded-lg hover:bg-violet-500/10 text-slate-500 hover:text-violet-400 transition-colors" title="AI Interview Prep">
                        <Sparkles className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => openEditModal(item)} className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-50">
                        {deletingId === item.id ? <Loader size="sm" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* ── Add / Edit Modal ─────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative cp-card w-full max-w-lg p-8 rounded-2xl shadow-2xl z-10">
            <button onClick={closeModal} className="absolute top-4 right-4 cp-text-secondary hover:cp-text-primary transition-colors">
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-bold cp-text-primary mb-6">
              {editingApp ? 'Edit Application' : 'Add New Application'}
            </h2>

            <form id="application-form" onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'company', label: 'Company *', type: 'text', placeholder: 'e.g. Google' },
                { id: 'role', label: 'Role *', type: 'text', placeholder: 'e.g. Software Engineering Intern' },
                { id: 'location', label: 'Location *', type: 'text', placeholder: 'e.g. Remote' },
                { id: 'resumeScore', label: 'Resume Score (0–100)', type: 'number', placeholder: 'e.g. 82' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label className="block text-xs font-semibold cp-text-secondary uppercase tracking-wider mb-1.5">
                    {label}
                  </label>
                  <input
                    id={`modal-${id}`}
                    type={type}
                    value={formData[id]}
                    onChange={(e) => setFormData((f) => ({ ...f, [id]: e.target.value }))}
                    required={['company', 'role', 'location'].includes(id)}
                    placeholder={placeholder}
                    min={type === 'number' ? 0 : undefined}
                    max={type === 'number' ? 100 : undefined}
                    className="block w-full cp-bg-surface border border-cp-border rounded-xl px-4 py-2.5 text-sm cp-text-primary placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold cp-text-secondary uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  id="modal-status"
                  value={formData.status}
                  onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                  className="block w-full cp-bg-surface border border-cp-border rounded-xl px-4 py-2.5 text-sm cp-text-primary focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  {['applied', 'interviewing', 'offer', 'rejected', 'withdrawn'].map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold cp-text-secondary uppercase tracking-wider mb-1.5">
                  Notes
                </label>
                <textarea
                  id="modal-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Any notes about this application…"
                  rows={3}
                  className="block w-full cp-bg-surface border border-cp-border rounded-xl px-4 py-2.5 text-sm cp-text-primary placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-cp-border rounded-xl text-sm cp-text-secondary hover:cp-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="modal-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader size="sm" />
                      Saving…
                    </>
                  ) : editingApp ? (
                    'Save Changes'
                  ) : (
                    'Add Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* ── AI Prep Modal ────────────────────────────────────────────────────── */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !aiLoading && setShowAiModal(false)} />
          <div className="relative cp-card w-full max-w-xl p-8 rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            {!aiLoading && (
              <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 cp-text-secondary hover:cp-text-primary transition-colors">
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-violet-500/10 rounded-xl text-violet-400">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold cp-text-primary">AI Interview Prep</h2>
                <p className="text-xs cp-text-secondary">{activeAiApp?.role} at {activeAiApp?.company}</p>
              </div>
            </div>

            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader size="lg" label="Generating personalized interview questions..." />
              </div>
            ) : aiData ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Likely Questions
                  </h3>
                  <ul className="space-y-3">
                    {aiData.questions?.map((q, idx) => (
                      <li key={idx} className="p-4 bg-slate-800/50 rounded-xl text-sm cp-text-primary border border-slate-700/50">
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Pro Tip</h3>
                  <p className="text-sm cp-text-primary">{aiData.tip}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-red-400">
                <p>Failed to load AI response.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
