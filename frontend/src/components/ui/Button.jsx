import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @typedef {Object} ButtonProps
 * @property {'primary' | 'secondary' | 'ghost' | 'danger'} [variant='primary'] - Visual style variant
 * @property {'sm' | 'md' | 'lg'} [size='md'] - Size of the button
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {boolean} [loading=false] - Shows a spinner and disables interaction
 * @property {React.ElementType} [icon] - Optional Lucide icon component rendered before children
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} children - Button label content
 * @property {Function} [onClick] - Click handler
 * @property {'button' | 'submit' | 'reset'} [type='button'] - HTML button type
 */

const variantMap = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30',
  secondary:
    'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600',
  ghost:
    'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/50',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/20',
};

const variantMapLight = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/20',
  secondary:
    'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 hover:border-slate-400',
  ghost:
    'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/20',
};

const sizeMap = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
};

/**
 * Button — A versatile button component supporting multiple variants, sizes, loading, and icon states.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  children,
  onClick,
  type = 'button',
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900
        ${sizeMap[size]}
        dark:${variantMap[variant]} ${variantMapLight[variant]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="animate-spin h-4 w-4 flex-shrink-0" />
      ) : Icon ? (
        <Icon className="h-4 w-4 flex-shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
