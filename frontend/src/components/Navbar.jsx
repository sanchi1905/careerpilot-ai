import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, ArrowRight, Sun, Moon, LayoutGrid } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Showcase', path: '/showcase', icon: LayoutGrid },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="cp-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-indigo-600/10 rounded-xl border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors duration-300">
                <Compass className="h-6 w-6 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent dark:from-white dark:via-slate-100 dark:to-indigo-200">
                CareerPilot <span className="text-indigo-400">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-indigo-400 font-semibold'
                    : 'text-cp-text-secondary hover:text-cp-text-primary'
                }`}
              >
                {link.icon && <link.icon className="h-3.5 w-3.5" />}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle"
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-xl border border-cp-border text-cp-text-secondary hover:text-cp-text-primary hover:border-indigo-500/40 transition-all duration-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/login"
              className="inline-flex items-center space-x-1 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              id="theme-toggle-mobile"
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg border border-cp-border text-cp-text-secondary transition-colors duration-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-slate-800/50 focus:outline-none transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-cp-border cp-bg px-4 pt-2 pb-4 space-y-1 shadow-2xl">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                isActive(link.path)
                  ? 'bg-slate-800 text-indigo-400'
                  : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-slate-800/40'
              }`}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-cp-border">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-1 w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200"
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
