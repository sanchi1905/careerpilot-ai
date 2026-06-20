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
    <div className="flex flex-col min-h-screen cp-page">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Dashboard Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-cp-border pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold cp-text-primary">Application Dashboard</h1>
            <p className="cp-text-secondary text-sm mt-1">Track and manage your placement interviews in real-time.</p>
          </div>
          <span className="mt-4 md:mt-0 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full inline-block">
            Connected to placements database
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="cp-card p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm cp-text-secondary font-medium">{stat.title}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <h2 className="text-3xl font-bold cp-text-primary mt-4">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {columns.map((col, idx) => (
            <div key={idx} className="cp-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold cp-text-primary flex items-center space-x-2">
                  <span>{col.title}</span>
                  <span className="text-xs bg-slate-800 dark:bg-slate-800 light:bg-slate-200 px-2 py-0.5 rounded-full cp-text-secondary">
                    {col.count}
                  </span>
                </h3>
              </div>

              <div className="space-y-4">
                {col.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="cp-card p-5 hover:border-indigo-500/30 transition-colors duration-200 cursor-pointer"
                    style={{ borderRadius: '0.75rem' }}
                  >
                    <span className="text-xs text-indigo-400 font-semibold">{item.company}</span>
                    <h4 className="font-bold cp-text-primary text-sm mt-1">{item.role}</h4>
                    <p className="cp-text-secondary text-xs mt-1">{item.location}</p>
                    <div className="mt-4 pt-3 border-t border-cp-border flex items-center justify-between text-[11px] cp-text-secondary">
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
