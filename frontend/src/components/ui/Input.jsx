import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * @typedef {Object} InputProps
 * @property {string} [label] - Label text displayed above the input
 * @property {string} [placeholder] - Placeholder text inside the input
 * @property {'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'} [type='text'] - HTML input type
 * @property {string} [error] - Error message shown below the input; also highlights with red border
 * @property {string} [hint] - Helper text shown below the input (ignored when error is set)
 * @property {React.ElementType} [icon] - Lucide icon shown on the left side of the input
 * @property {React.ElementType} [rightIcon] - Lucide icon shown on the right side of the input
 * @property {boolean} [disabled=false] - Disables the input
 * @property {string} [className] - Additional CSS classes applied to the wrapper div
 * @property {string} [inputClassName] - Additional CSS classes applied to the <input> element
 * @property {string} [id] - HTML id; if not provided, label will not be linked
 * @property {string} [value] - Controlled value
 * @property {Function} [onChange] - Change handler
 */

/**
 * Input — A styled form input with label, error, hint, and icon support.
 * Forwards refs to the underlying <input> element.
 */
const Input = forwardRef(function Input(
  {
    label,
    placeholder,
    type = 'text',
    error,
    hint,
    icon: Icon,
    rightIcon: RightIcon,
    disabled = false,
    className = '',
    inputClassName = '',
    id,
    value,
    onChange,
    ...rest
  },
  ref
) {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400 light:text-slate-600"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={`h-4 w-4 ${hasError ? 'text-red-400' : 'text-slate-500 dark:text-slate-500'}`}
            />
          </div>
        )}

        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full rounded-xl border py-2.5 text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            placeholder:text-slate-500
            ${Icon ? 'pl-10' : 'pl-4'}
            ${RightIcon ? 'pr-10' : 'pr-4'}
            ${
              hasError
                ? 'border-red-500/70 bg-red-500/5 text-red-200 focus:ring-red-500 focus:border-red-500 dark:focus:ring-offset-slate-900'
                : 'border-slate-700/80 bg-slate-900/60 dark:bg-slate-900/60 text-slate-200 dark:text-slate-200 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-offset-slate-900 light:bg-white light:text-slate-800 light:border-slate-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${inputClassName}
          `}
          {...rest}
        />

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <RightIcon className="h-4 w-4 text-slate-500" />
          </div>
        )}
      </div>

      {hasError ? (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-slate-500 dark:text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
