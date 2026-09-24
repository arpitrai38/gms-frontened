import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { AuthModal } from './AuthModal';

export const HomePage = () => {
  const { plans, isBackendConnected } = useGym();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('admin');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState('Gold Pro Athlete');

  const openAuth = (tab = 'admin', plan = 'Gold Pro Athlete') => {
    setModalTab(tab);
    setSelectedPlanForModal(plan);
    setIsAuthModalOpen(true);
  };

  const facilities = [
    {
      title: 'Heavy Strength Arena',
      desc: 'Eleiko calibrated plates, competition benches, power racks, and dumbbells up to 60kg.',
      icon: '🏋️',
      tag: 'Pro Lifting'
    },
    {
      title: 'Functional Crossfit Turf',
      desc: '30-meter indoor sprint turf, Rogue sleds, battle ropes, plyo boxes, and gymnastics rings.',
      icon: '⚡',
      tag: 'Endurance'
    },
    {
      title: 'Cardio & Stamina Zone',
      desc: 'Woodway curved treadmills, Concept2 rowers, SkiErgs, and assault bikes with heart-rate sync.',
      icon: '🏃',
      tag: 'Stamina'
    },
    {
      title: 'Sauna & Ice Bath Recovery',
      desc: 'Finnish cedar dry sauna and temperature-regulated cold plunge tubs for peak muscle regeneration.',
      icon: '❄️',
      tag: 'Recovery'
    },
    {
      title: 'Smart QR Access & Pass',
      desc: 'Zero plastic cards. Instant contactless entry via your dynamic smartphone digital pass.',
      icon: '📱',
      tag: 'Digital'
    },
    {
      title: 'Protein Fuel & Nutrition Bar',
      desc: 'Fresh whey isolate shakes, pre-workout hydration, cold-brew coffee, and macro-balanced meal prep.',
      icon: '🥤',
      tag: 'Nutrition'
    }
  ];

  const trainers = [
    {
      name: 'Viktor Vance',
      role: 'Head Strength Coach',
      specialty: 'Powerlifting & Hypertrophy Biomechanics',
      exp: '8+ Years Exp',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=250&auto=format&fit=crop&q=80',
      badge: 'CSCS Certified'
    },
    {
      name: 'Sarah Connor',
      role: 'Mobility & Yoga Director',
      specialty: 'Power Vinyasa, Injury Prevention & Breathwork',
      exp: '6+ Years Exp',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
      badge: 'RYT-500'
    },
    {
      name: 'Marcus Hayes',
      role: 'Athletic Conditioning Coach',
      specialty: 'Sprint Mechanics & High-Intensity Calisthenics',
      exp: '7+ Years Exp',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
      badge: 'NASM-PES'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-xl">
              ⚡
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center">
                IRON<span className="text-indigo-400">PULSE</span>
                <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  CLUB
                </span>
              </span>
              <p className="text-[10px] font-medium text-slate-400 tracking-wider">FITNESS & ATHLETICS ERP</p>
            </div>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#facilities" className="hover:text-indigo-400 transition-colors">Facilities</a>
            <a href="#pricing" className="hover:text-indigo-400 transition-colors">Membership Plans</a>
            <a href="#trainers" className="hover:text-indigo-400 transition-colors">Coaches</a>
            <a href="#schedule" className="hover:text-indigo-400 transition-colors">Class Schedule</a>
          </nav>

          {/* Portal Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => openAuth('member')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all"
            >
              👤 Member Login
            </button>
            <button
              onClick={() => openAuth('admin')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-600/50 transition-all hidden sm:block"
            >
              🛡️ Admin / Staff
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              ⚡ Join Gym Now
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Status pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-semibold text-slate-300">
                {isBackendConnected ? '🍃 MongoDB Database Connected & Live' : '⚡ Complete Gym Management System Ready'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
              ELEVATE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-400">
                STRENGTH & PHYSIQUE
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Welcome to the next generation of athletic performance. Elite barbell equipment, certified personal coaches, automated QR check-in, and personalized diet macros.
            </p>

            {/* Portal Action Cards in Hero */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div
                onClick={() => openAuth('admin')}
                className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all shadow-xl text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition-transform">
                  🛡️
                </div>
                <h3 className="font-bold text-white text-sm">Admin Portal</h3>
                <p className="text-xs text-slate-400 mt-1">Manage members, payments, staff & reports</p>
                <span className="inline-block mt-3 text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Enter Portal →
                </span>
              </div>

              <div
                onClick={() => openAuth('trainer')}
                className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all shadow-xl text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition-transform">
                  🏋️
                </div>
                <h3 className="font-bold text-white text-sm">Trainer Portal</h3>
                <p className="text-xs text-slate-400 mt-1">Assign workouts, manage diet & clients</p>
                <span className="inline-block mt-3 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  Enter Portal →
                </span>
              </div>

              <div
                onClick={() => openAuth('member')}
                className="group p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all shadow-xl text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl font-bold mb-3 group-hover:scale-110 transition-transform">
                  👤
                </div>
                <h3 className="font-bold text-white text-sm">Trainee Hub</h3>
                <p className="text-xs text-slate-400 mt-1">Digital QR pass, routines, diet & bills</p>
                <span className="inline-block mt-3 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Enter Portal →
                </span>
              </div>
            </div>

            {/* Quick Demo Credentials Strip */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Quick Test Credentials:</span>
              <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                Admin: <code className="text-indigo-400">admin@gym.com / admin123</code>
              </span>
              <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                Trainer: <code className="text-amber-400">trainer@gym.com / trainer123</code>
              </span>
              <span className="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                Trainee: <code className="text-emerald-400">member@gym.com / member123</code>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHT METRICS STRIP */}
      <section className="py-8 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-white">24/7</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Facility Access</div>
          </div>
          <div>
            <div className="text-3xl font-black text-indigo-400">50+</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Heavy Olympic Stations</div>
          </div>
          <div>
            <div className="text-3xl font-black text-amber-400">100%</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Digital QR Check-in</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400">MongoDB</div>
            <div className="text-xs font-medium text-slate-400 mt-1">Zero Dummy Clutter</div>
          </div>
        </div>
      </section>

      {/* 4. FACILITIES SECTION */}
      <section id="facilities" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">World-Class Infrastructure</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Engineered For Serious Results</h2>
          <p className="text-sm text-slate-400 mt-3">Every square foot is designed to maximize output, recovery, and overall member satisfaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all hover:-translate-y-1 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{fac.icon}</span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {fac.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{fac.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{fac.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING & MEMBERSHIP PLANS */}
      <section id="pricing" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-black tracking-widest text-purple-400 uppercase">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Membership Plans For Every Goal</h2>
            <p className="text-sm text-slate-400 mt-3">Choose the plan that matches your training frequency and coaching needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-3xl transition-all flex flex-col justify-between ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 scale-105'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-black text-white uppercase tracking-widest shadow-md">
                    ★ MOST POPULAR
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-black text-white">${plan.price}</span>
                    <span className="text-xs text-slate-400 ml-1.5">/{plan.billingPeriod || 'month'}</span>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    {(plan.features || []).map((feat, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-indigo-400 font-bold">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openAuth('register', plan.name)}
                  className={`mt-8 w-full py-3 rounded-xl font-bold text-xs transition-all ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Choose {plan.name} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STAR COACHES & TRAINERS */}
      <section id="trainers" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-amber-400 uppercase">Expert Guidance</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Meet Our Elite Coaching Staff</h2>
          <p className="text-sm text-slate-400 mt-3">Degree-holding strength specialists, sports nutritionists, and certified master trainers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((tr, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden group hover:border-slate-700 transition-all"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={tr.avatar}
                  alt={tr.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold text-amber-400">
                  {tr.badge}
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-indigo-400">{tr.role}</span>
                <h3 className="text-xl font-bold text-white mt-1">{tr.name}</h3>
                <p className="text-xs text-slate-400 mt-2">{tr.specialty}</p>
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{tr.exp}</span>
                  <button
                    onClick={() => openAuth('register')}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    Book Session →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              ⚡
            </div>
            <div>
              <span className="font-bold text-white text-sm">IRONPULSE FITNESS CLUB</span>
              <p className="text-[11px] text-slate-400">Operating Hours: Mon-Sun 05:00 AM – 11:00 PM</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <button onClick={() => openAuth('admin')} className="hover:text-indigo-400">Admin Login</button>
            <button onClick={() => openAuth('trainer')} className="hover:text-amber-400">Trainer Login</button>
            <button onClick={() => openAuth('member')} className="hover:text-emerald-400">Trainee Login</button>
            <button onClick={() => openAuth('register')} className="hover:text-purple-400">New Registration</button>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 IronPulse Fitness. Backed by MongoDB.
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={modalTab}
        initialPlan={selectedPlanForModal}
      />
    </div>
  );
};
