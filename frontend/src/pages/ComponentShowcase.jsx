import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Input, Modal, Loader, useToast } from '../components/ui';
import {
  Search,
  Mail,
  Lock,
  Send,
  Trash2,
  Plus,
  Download,
  Zap,
  LayoutGrid,
} from 'lucide-react';

/**
 * ComponentShowcase — Demonstrates all 5 UI components from the component library.
 * Route: /showcase
 */
export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { addToast } = useToast();

  const simulateLoading = () => {
    setLoadingBtn(true);
    setTimeout(() => {
      setLoadingBtn(false);
      addToast('Action completed successfully!', 'success');
    }, 2000);
  };

  const validateEmail = (val) => {
    setEmailValue(val);
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setInputError('Please enter a valid email address.');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cp-bg">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Page Header */}
        <div className="border-b border-cp-border pb-8 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-4">
            <LayoutGrid className="h-3.5 w-3.5" />
            Component Library
          </div>
          <h1 className="text-4xl font-extrabold text-cp-text-primary">
            UI Showcase
          </h1>
          <p className="mt-2 text-cp-text-secondary max-w-xl">
            All 5 components from <code className="text-indigo-400 text-sm">/components/ui/</code> demonstrated live.
            Toggle dark / light mode in the navbar to see both themes.
          </p>
        </div>

        <div className="space-y-16">
          {/* ── SECTION 1: Button ─────────────────────────────── */}
          <section id="section-button">
            <SectionTitle number="01" title="Button" file="Button.jsx" />
            <p className="text-cp-text-secondary text-sm mb-6">
              Props: <code className="text-indigo-400">variant</code>, <code className="text-indigo-400">size</code>,{' '}
              <code className="text-indigo-400">disabled</code>, <code className="text-indigo-400">loading</code>,{' '}
              <code className="text-indigo-400">icon</code>
            </p>

            <div className="cp-card p-6 space-y-6">
              <div>
                <Label>Variants</Label>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button variant="primary" icon={Zap}>Primary</Button>
                  <Button variant="secondary" icon={Download}>Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger" icon={Trash2}>Danger</Button>
                </div>
              </div>

              <div>
                <Label>Sizes</Label>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <Label>States</Label>
                <div className="flex flex-wrap gap-3 mt-3">
                  <Button disabled>Disabled</Button>
                  <Button loading={loadingBtn} onClick={simulateLoading}>
                    {loadingBtn ? 'Processing…' : 'Click to Load'}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: Input ──────────────────────────────── */}
          <section id="section-input">
            <SectionTitle number="02" title="Input" file="Input.jsx" />
            <p className="text-cp-text-secondary text-sm mb-6">
              Props: <code className="text-indigo-400">label</code>, <code className="text-indigo-400">placeholder</code>,{' '}
              <code className="text-indigo-400">type</code>, <code className="text-indigo-400">error</code>,{' '}
              <code className="text-indigo-400">hint</code>, <code className="text-indigo-400">icon</code>,{' '}
              <code className="text-indigo-400">disabled</code>
            </p>

            <div className="cp-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="showcase-search"
                label="Search Jobs"
                placeholder="e.g. Software Engineer at Google"
                icon={Search}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                hint="Type a role or company name to search"
              />
              <Input
                id="showcase-email"
                label="Email Address"
                type="email"
                placeholder="name@university.edu"
                icon={Mail}
                value={emailValue}
                onChange={(e) => validateEmail(e.target.value)}
                error={inputError}
              />
              <Input
                id="showcase-password"
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                hint="Must be at least 8 characters"
              />
              <Input
                id="showcase-disabled"
                label="Disabled Field"
                placeholder="Cannot edit this"
                disabled
                hint="This field is read-only"
              />
            </div>
          </section>

          {/* ── SECTION 3: Modal ──────────────────────────────── */}
          <section id="section-modal">
            <SectionTitle number="03" title="Modal" file="Modal.jsx" />
            <p className="text-cp-text-secondary text-sm mb-6">
              Props: <code className="text-indigo-400">isOpen</code>, <code className="text-indigo-400">onClose</code>,{' '}
              <code className="text-indigo-400">title</code>, <code className="text-indigo-400">size</code>,{' '}
              <code className="text-indigo-400">footer</code>, <code className="text-indigo-400">showCloseButton</code>
            </p>

            <div className="cp-card p-6">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
                  Open Info Modal
                </Button>
                <Button variant="danger" icon={Trash2} onClick={() => setConfirmModalOpen(true)}>
                  Open Confirm Modal
                </Button>
              </div>
            </div>

            {/* Info Modal */}
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Add New Application"
              size="md"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    icon={Send}
                    onClick={() => {
                      setModalOpen(false);
                      addToast('Application saved!', 'success');
                    }}
                  >
                    Save
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                <Input id="modal-company" label="Company" placeholder="e.g. Google" />
                <Input id="modal-role" label="Role" placeholder="e.g. Software Engineering Intern" />
              </div>
            </Modal>

            {/* Confirm Modal */}
            <Modal
              isOpen={confirmModalOpen}
              onClose={() => setConfirmModalOpen(false)}
              title="Delete Application?"
              size="sm"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={() => {
                      setConfirmModalOpen(false);
                      addToast('Application deleted.', 'error');
                    }}
                  >
                    Delete
                  </Button>
                </>
              }
            >
              <p className="text-sm">
                This will permanently remove the application from your board. This action cannot be undone.
              </p>
            </Modal>
          </section>

          {/* ── SECTION 4: Toast ──────────────────────────────── */}
          <section id="section-toast">
            <SectionTitle number="04" title="Toast" file="Toast.jsx" />
            <p className="text-cp-text-secondary text-sm mb-6">
              Via <code className="text-indigo-400">useToast()</code> hook — Props:{' '}
              <code className="text-indigo-400">message</code>, <code className="text-indigo-400">type</code>,{' '}
              <code className="text-indigo-400">duration</code>
            </p>

            <div className="cp-card p-6">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => addToast('Application saved successfully!', 'success')}
                >
                  ✅ Success Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => addToast('Failed to connect to server.', 'error')}
                >
                  ❌ Error Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => addToast('Your session expires in 5 minutes.', 'warning')}
                >
                  ⚠️ Warning Toast
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => addToast('3 new job matches found for you!', 'info')}
                >
                  ℹ️ Info Toast
                </Button>
              </div>
            </div>
          </section>

          {/* ── SECTION 5: Loader ─────────────────────────────── */}
          <section id="section-loader">
            <SectionTitle number="05" title="Loader" file="Loader.jsx" />
            <p className="text-cp-text-secondary text-sm mb-6">
              Props: <code className="text-indigo-400">variant</code>, <code className="text-indigo-400">size</code>,{' '}
              <code className="text-indigo-400">label</code>, <code className="text-indigo-400">lines</code>
            </p>

            <div className="cp-card p-6 space-y-8">
              <div>
                <Label>Spinner variant</Label>
                <div className="flex flex-wrap items-center gap-8 mt-4">
                  <Loader variant="spinner" size="sm" />
                  <Loader variant="spinner" size="md" />
                  <Loader variant="spinner" size="lg" />
                  <Loader variant="spinner" size="xl" />
                </div>
              </div>

              <div>
                <Label>Dots variant</Label>
                <div className="flex flex-wrap items-center gap-8 mt-4">
                  <Loader variant="dots" size="sm" />
                  <Loader variant="dots" size="md" />
                  <Loader variant="dots" size="lg" />
                </div>
              </div>

              <div>
                <Label>Skeleton variant</Label>
                <div className="max-w-sm mt-4">
                  <Loader variant="skeleton" lines={4} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/** Internal helpers */
function SectionTitle({ number, title, file }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="text-3xl font-black text-indigo-500/30">{number}</span>
      <div>
        <h2 className="text-2xl font-bold text-cp-text-primary">{title}</h2>
        <code className="text-xs text-slate-500">/components/ui/{file}</code>
      </div>
    </div>
  );
}

function Label({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
      {children}
    </p>
  );
}
