import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Target, Shield, Heart } from 'lucide-react';

export default function About() {
  const sections = [
    {
      title: 'Our Mission',
      content: 'We aim to democratize the placement preparation process, making high-end AI analysis and tools available to every student, regardless of background.',
      icon: Target,
    },
    {
      title: 'Reliable Insights',
      content: 'We build algorithms that securely match your skillset against millions of online job descriptions to ensure accurate skill gap predictions.',
      icon: Shield,
    },
    {
      title: 'Student-First Focus',
      content: 'Every product update is designed to make preparation lighter, tracking faster, and outcomes more achievable for young professionals.',
      icon: Heart,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19]">
      <Navbar />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            About{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              CareerPilot AI
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Learn how we are building the future of AI-driven student placement tracking and placement readiness.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-[#111827]/30 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-sm">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 inline-block">
                <section.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mt-6">{section.title}</h3>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Standard Placeholder Requirements */}
        <div className="mt-16 text-center max-w-xl mx-auto border-t border-slate-800/60 pt-10">
          <h2 className="text-xl font-bold text-slate-200">System Platform Architecture</h2>
          <p className="text-slate-400 text-sm mt-2">
            CareerPilot AI operates on an asynchronous distributed event model, parsing resume metrics, parsing public databases, and storing structured logs securely.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
