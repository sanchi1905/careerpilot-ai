import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { Layers, BrainCircuit, Mic } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'AI Job Tracking',
      description: 'Log and monitor your job/internship applications automatically. Never miss a deadline, interview, or follow-up with smart Kanban-style boards.',
      badge: 'Core',
      icon: Layers,
      actionText: 'Start tracking',
    },
    {
      title: 'Skill Gap Analyzer',
      description: 'Upload job descriptions to instantly discover which tools and concepts you are missing. Get targeted recommendations to bridge the gap.',
      badge: 'AI Powered',
      icon: BrainCircuit,
      actionText: 'Analyze skills',
    },
    {
      title: 'Interview Simulator',
      description: 'Conduct practice interviews tailored specifically to the roles you apply for. Get automated sentiment and technical score reviews.',
      badge: 'Smart Assist',
      icon: Mic,
      actionText: 'Launch prep',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <section className="py-16 border-t border-slate-900 bg-[#0A0D15]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Supercharge Your Career Preparation
              </h2>
              <p className="mt-4 text-slate-400">
                Skip the spreadsheets and manual prep. Leverage AI built specifically to organize and boost your placement outcomes.
              </p>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <Card
                  key={idx}
                  title={feature.title}
                  description={feature.description}
                  badge={feature.badge}
                  icon={feature.icon}
                  actionText={feature.actionText}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
