import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Briefcase, CheckCircle, Clock, FileText } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Total Applications', value: '24', icon: Briefcase, color: 'text-indigo-400' },
    { title: 'Interviews Scheduled', value: '5', icon: Clock, color: 'text-amber-400' },
    { title: 'Offers Received', value: '2', icon: CheckCircle, color: 'text-emerald-400' },
    { title: 'Resume Fit Score', value: '78%', icon: FileText, color: 'text-purple-400' },
  ];

  const columns = [
    {
      title: 'Applied',
      count: '12',
      items: [
        { company: 'Google', role: 'Software Engineering Intern', location: 'Remote', status: 'Applied 2d ago' },
        { company: 'Stripe', role: 'Frontend Engineer', location: 'San Francisco, CA', status: 'Applied 5d ago' },
      ],
    },
    {
      title: 'Interviewing',
      count: '4',
      items: [
        { company: 'Meta', role: 'Product Engineering Intern', location: 'Menlo Park, CA', status: 'Technical Round 2 scheduled' },
        { company: 'Netflix', role: 'UI Developer', location: 'Los Gatos, CA', status: 'System Design scheduled' },
      ],
    },
    {
      title: 'Offers',
      count: '2',
      items: [
        { company: 'Vercel', role: 'Developer Advocate', location: 'Remote', status: 'Offer Letter Sent' },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19]">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Dashboard Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Application Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Track and manage your placement interviews in real-time.</p>
          </div>
          <span className="mt-4 md:mt-0 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full inline-block">
            Connected to placements database
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#111827]/30 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-medium">{stat.title}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <h2 className="text-3xl font-bold text-white mt-4">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Kanban Board Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {columns.map((col, idx) => (
            <div key={idx} className="bg-[#0A0D15]/60 border border-slate-900 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center space-x-2">
                  <span>{col.title}</span>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                    {col.count}
                  </span>
                </h3>
              </div>

              <div className="space-y-4">
                {col.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-[#111827]/40 border border-slate-850 p-5 rounded-xl hover:border-slate-700 transition-colors duration-200 cursor-pointer">
                    <span className="text-xs text-indigo-400 font-semibold">{item.company}</span>
                    <h4 className="font-bold text-slate-200 text-sm mt-1">{item.role}</h4>
                    <p className="text-slate-400 text-xs mt-1">{item.location}</p>
                    <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
