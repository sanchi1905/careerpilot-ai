import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Card — Feature card component used on the Home page.
 * Props: title, description, badge, icon, actionText, href
 */
export default function Card({ title, description, badge, icon: Icon, actionText = 'Learn more', href = '#' }) {
  return (
    <div className="group relative cp-card rounded-3xl p-8 hover-glow transition-all duration-300 flex flex-col justify-between">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold cp-text-primary mt-6 group-hover:text-indigo-400 transition-colors duration-200">
          {title}
        </h3>
        <p className="cp-text-secondary text-sm mt-3 leading-relaxed">{description}</p>
      </div>

      {/* Action footer */}
      <div className="mt-8 flex items-center justify-between border-t border-cp-border pt-4">
        <span className="text-xs font-semibold cp-text-secondary group-hover:text-indigo-300 transition-colors duration-200">
          {actionText}
        </span>
        <div className="p-1.5 rounded-full border border-cp-border cp-text-secondary group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-300">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
