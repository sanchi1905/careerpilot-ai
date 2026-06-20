import React from 'react';

/**
 * @typedef {Object} LoaderProps
 * @property {'sm' | 'md' | 'lg' | 'xl'} [size='md'] - Controls dimensions of the spinner or skeleton blocks
 * @property {'spinner' | 'dots' | 'skeleton'} [variant='spinner'] - Visual loading style
 * @property {string} [className] - Additional CSS classes on the wrapper element
 * @property {string} [label='Loading...'] - Accessible label (used as aria-label and visible only to screen readers)
 * @property {number} [lines=3] - Number of skeleton lines rendered when variant is 'skeleton'
 */

const spinnerSizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
  xl: 'h-16 w-16 border-4',
};

const dotSizeMap = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2.5 w-2.5',
  lg: 'h-3.5 w-3.5',
  xl: 'h-4 w-4',
};

/**
 * Loader — A flexible loading indicator supporting spinner, bouncing-dots, and skeleton variants.
 */
export default function Loader({
  size = 'md',
  variant = 'spinner',
  className = '',
  label = 'Loading...',
  lines = 3,
}) {
  if (variant === 'spinner') {
    return (
      <div
        role="status"
        aria-label={label}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <span
          className={`
            rounded-full border-slate-700 border-t-indigo-400
            animate-spin ${spinnerSizeMap[size]}
          `}
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div
        role="status"
        aria-label={label}
        className={`inline-flex items-center gap-1.5 ${className}`}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`
              rounded-full bg-indigo-400
              animate-bounce ${dotSizeMap[size]}
            `}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  if (variant === 'skeleton') {
    const heights = ['h-4', 'h-4', 'h-3'];
    const widths = ['w-full', 'w-4/5', 'w-2/3'];
    return (
      <div
        role="status"
        aria-label={label}
        className={`flex flex-col gap-3 ${className}`}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`
              rounded-lg bg-slate-800 dark:bg-slate-800 light:bg-slate-200
              animate-pulse
              ${heights[i % heights.length]}
              ${widths[i % widths.length]}
            `}
          />
        ))}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return null;
}
