import React from 'react';
import { Compass, Github, Twitter, Linkedin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090D16] border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Pitch */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-indigo-500" />
              <span className="text-lg font-bold text-white tracking-wide">
                CareerPilot <span className="text-indigo-500">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering students and freshers to land their dream placements using AI insights and tracking.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-200">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-200">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-200">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200">AI Tracking</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200">Skill Analysis</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200">Interview Prep</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Company</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-200">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Stay Updated</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Get the latest placement guidelines and resources delivered to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-[#111827]/60 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-slate-400 text-xs">
          <span>&copy; {new Date().getFullYear()} CareerPilot AI. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Built for GEU LMS Week 2 Placement Project</span>
        </div>
      </div>
    </footer>
  );
}
