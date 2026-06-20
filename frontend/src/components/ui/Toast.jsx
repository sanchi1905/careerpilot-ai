import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * @typedef {'success' | 'error' | 'warning' | 'info'} ToastType
 *
 * @typedef {Object} ToastItem
 * @property {string} id - Unique identifier for the toast
 * @property {ToastType} type - Visual style/icon variant
 * @property {string} message - Message text displayed in the toast
 * @property {number} [duration=4000] - Auto-dismiss duration in milliseconds (0 = persistent)
 *
 * @typedef {Object} ToastContextValue
 * @property {Function} addToast - (message: string, type: ToastType, duration?: number) => void
 * @property {Function} removeToast - (id: string) => void
 */

const ToastContext = createContext(undefined);

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error: 'border-red-500/40 bg-red-500/10 text-red-300',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  info: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
};

/** Single Toast item */
function ToastItem({ toast, onRemove }) {
  const Icon = iconMap[toast.type] || Info;

  return (
    <div
      className={`
        flex items-start gap-3 w-80 max-w-full rounded-xl border p-4
        shadow-2xl backdrop-blur-md
        animate-[toastIn_0.3s_ease-out]
        ${colorMap[toast.type]}
      `}
      role="alert"
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/**
 * ToastProvider — Wrap your app (or a subtree) with this to enable toasts.
 * Renders a portal-style stack in the bottom-right corner.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast stack */}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * useToast — Access addToast and removeToast from any component inside ToastProvider.
 * @returns {{ addToast: Function, removeToast: Function }}
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

/** Default export for direct import convenience (the provider) */
export default ToastProvider;
