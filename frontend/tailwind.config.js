/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 'dark' class on <html> enables dark mode
  theme: {
    extend: {
      colors: {
        'cp-bg':         'var(--cp-bg)',
        'cp-surface':    'var(--cp-bg-surface)',
        'cp-card':       'var(--cp-bg-card)',
        'cp-border':     'var(--cp-border)',
        'cp-primary':    'var(--cp-text-primary)',
        'cp-secondary':  'var(--cp-text-secondary)',
        'cp-accent':     'var(--cp-accent)',
      },
    },
  },
  plugins: [],
}
