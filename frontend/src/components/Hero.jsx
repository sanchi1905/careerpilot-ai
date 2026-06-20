import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, CheckCircle, BrainCircuit } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Banner Pill */}
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 mb-8 animate-pulse">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Intelligent Career Companion for Freshers</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight cp-text-primary leading-tight max-w-4xl mx-auto">
          Navigate Your Career with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Precision
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl cp-text-secondary max-w-2xl mx-auto leading-relaxed">
          Track job applications, detect skill gaps, and simulate placement interviews.
          A smart platform designed specifically for students and fresh grads.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/30"
          >
            <span>Start Free Journey</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center cp-card border-cp-border cp-text-secondary hover:cp-text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-200"
          >
            How it works
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="cp-card p-6 flex flex-col items-center justify-center">
            <TrendingUp className="h-6 w-6 text-emerald-400 mb-2" />
            <span className="text-2xl font-bold cp-text-primary">85%</span>
            <span className="text-xs cp-text-secondary mt-1">Placement Growth</span>
          </div>
          <div className="cp-card p-6 flex flex-col items-center justify-center">
            <BrainCircuit className="h-6 w-6 text-indigo-400 mb-2" />
            <span className="text-2xl font-bold cp-text-primary">12+</span>
            <span className="text-xs cp-text-secondary mt-1">AI Features</span>
          </div>
          <div className="col-span-2 md:col-span-1 cp-card p-6 flex flex-col items-center justify-center">
            <CheckCircle className="h-6 w-6 text-violet-400 mb-2" />
            <span className="text-2xl font-bold cp-text-primary">100%</span>
            <span className="text-xs cp-text-secondary mt-1">Organized Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
