import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Controls whether the modal is visible
 * @property {Function} onClose - Callback invoked when the modal should close (backdrop click, ESC key, close button)
 * @property {string} [title] - Title text rendered in the modal header
 * @property {React.ReactNode} children - Content rendered inside the modal body
 * @property {'sm' | 'md' | 'lg' | 'xl'} [size='md'] - Controls the max-width of the modal panel
 * @property {boolean} [showCloseButton=true] - Whether to show the × close button in the header
 * @property {React.ReactNode} [footer] - Optional footer content (e.g., action buttons)
 */

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

/**
 * Modal — An accessible overlay dialog with backdrop, ESC-to-close, and scroll-lock.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  footer,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`
          relative w-full ${sizeMap[size]} rounded-2xl shadow-2xl
          border border-slate-700/80 dark:border-slate-700/80
          bg-[#111827] dark:bg-[#111827] light:bg-white
          animate-[modalIn_0.2s_ease-out]
        `}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b border-slate-700/60 px-6 py-4">
            {title && (
              <h3
                id="modal-title"
                className="text-lg font-bold text-white dark:text-white light:text-slate-900"
              >
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors duration-150"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 text-slate-300 dark:text-slate-300 light:text-slate-700">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-700/60 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
