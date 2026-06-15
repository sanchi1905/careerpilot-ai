import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Lock, ArrowRight, Compass } from 'lucide-react';

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-md w-full space-y-8 bg-[#111827]/40 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-md relative z-10">
          <div className="text-center">
            <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-4">
              <Compass className="h-8 w-8 animate-spin-slow" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to your CareerPilot AI workspace
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="rounded-md space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="name@university.edu"
                    className="block w-full bg-[#0B0F19]/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="block w-full bg-[#0B0F19]/60 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 bg-[#0B0F19] border-slate-800 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-offset-[#0B0F19]"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-600/20"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRight className="h-5 w-5 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                </span>
                Sign In
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-800/50">
            Don't have an account?{' '}
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Create an account
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
