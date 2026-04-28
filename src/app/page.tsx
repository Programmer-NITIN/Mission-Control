'use client';

import Link from 'next/link';

const stats = [
  { value: '1.2M', label: 'PEOPLE REACHED' },
  { value: '50k', label: 'ACTIVE VOLUNTEERS' },
  { value: '150', label: 'GLOBAL RESPONSE UNITS' },
];

const features = [
  {
    icon: 'public',
    title: 'Global Visibility',
    desc: 'Monitor deployment zones and supply chains in real-time across multiple regions simultaneously.',
    large: true,
  },
  {
    icon: 'lock',
    title: 'Secure Networks',
    desc: 'End-to-end encrypted communication for field operatives in volatile environments.',
  },
  {
    icon: 'inventory_2',
    title: 'Resource Allocation',
    desc: 'Algorithmic routing minimizes waste and accelerates delivery of critical medical and food supplies.',
  },
  {
    icon: 'group',
    title: 'Volunteer Coordination',
    desc: 'Seamless onboarding, credential verification, and task assignment for thousands of active responders.',
  },
];

const steps = [
  { num: '1', icon: 'radar', title: 'Monitor', desc: 'Aggregate continuous data streams from local partners, satellites, and on-ground sensors to identify emerging crises.' },
  { num: '2', icon: 'my_location', title: 'Locate', desc: 'Pinpoint exact requirements and match them against available regional inventories and volunteer rosters.' },
  { num: '3', icon: 'bolt', title: 'Execute', desc: 'Dispatch response units with precise directives, utilizing optimized routes to bypass logistical bottlenecks.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">public</span>
            </div>
            <span className="text-lg font-black tracking-tight text-on-surface">Mission Control</span>
          </Link>
          <Link href="/dashboard" className="btn-primary text-sm">
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-display-lg text-on-surface mb-6 leading-[1.05]">
              Turning Crisis<br />into Action.
            </h1>
            <p className="text-body-base text-on-surface-variant mb-8 max-w-md">
              Deploy resources faster, coordinate teams globally, and track real-time
              impact with an institutional-grade logistics platform built for modern NGOs.
            </p>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn-primary py-3 px-6 text-base">
                Partner With Us
              </Link>
              <Link href="/volunteers" className="btn-secondary py-3 px-6 text-base">
                Volunteer Now
              </Link>
            </div>
          </div>
          <div className="animate-slide-in-right relative">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-outline-variant bg-surface-container aspect-[4/3] relative">
              <img src="/hero-image.png" alt="Relief workers coordinating disaster response" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <p className="text-headline-lg text-white">Real-time Crisis Response</p>
                <p className="text-body-sm text-white/80 mt-1">Coordinating 50,000+ volunteers globally</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}>
              <div className="text-display-lg text-primary-container">{stat.value}</div>
              <div className="text-label-caps text-outline mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-[1440px] mx-auto px-8 py-20">
        <h2 className="text-headline-xl text-on-surface mb-3">The Mission Control Advantage</h2>
        <p className="text-body-base text-on-surface-variant mb-10 max-w-lg">
          Data-driven logistics and operational clarity to ensure aid reaches those who need it most, without delay.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`card card-hover ${f.large ? 'md:row-span-1 bg-gradient-to-br from-inverse-surface to-[#1a1d2e] text-inverse-on-surface' : ''}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                f.large ? 'bg-white/10' : 'bg-primary-fixed'
              }`}>
                <span className={`material-symbols-outlined text-[20px] ${
                  f.large ? 'text-inverse-on-surface' : 'text-primary-container'
                }`}>{f.icon}</span>
              </div>
              <h3 className={`text-headline-lg mb-2 ${f.large ? '' : 'text-on-surface'}`}>{f.title}</h3>
              <p className={`text-body-sm ${f.large ? 'text-inverse-on-surface/80' : 'text-on-surface-variant'}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-[1440px] mx-auto px-8 py-20 text-center">
          <h2 className="text-headline-xl text-on-surface mb-3">How it Works</h2>
          <p className="text-body-base text-on-surface-variant mb-12">
            A streamlined operational framework designed for high-stress scenarios.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="card card-hover text-center p-8 animate-slide-up"
                style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'both' }}>
                <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-[28px] text-primary-container">{step.icon}</span>
                </div>
                <h3 className="text-headline-lg text-on-surface mb-2">{step.num}. {step.title}</h3>
                <p className="text-body-sm text-on-surface-variant">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-inverse-surface">
        <div className="max-w-[1440px] mx-auto px-8 py-20 text-center">
          <h2 className="text-display-lg text-primary-fixed-dim mb-4" style={{ fontSize: '36px' }}>
            Join the Global Response
          </h2>
          <p className="text-body-base text-inverse-on-surface/80 mb-8 max-w-lg mx-auto">
            Whether you represent an organization ready to integrate systems or an individual willing to
            deploy, Mission Control relies on collective action.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/volunteers" className="btn-primary py-3 px-6">Register as a Volunteer</Link>
            <Link href="/dashboard" className="bg-transparent border border-inverse-on-surface/30 text-inverse-on-surface font-semibold text-sm py-3 px-6 rounded-lg hover:bg-white/10 transition-colors">
              Partnership Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center text-body-sm text-outline">
          <span>© 2026 NGO Global Impact Initiative. All rights reserved.</span>
          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-primary-container transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-container transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary-container transition-colors">Impact Report</a>
            <a href="#" className="hover:text-primary-container transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
