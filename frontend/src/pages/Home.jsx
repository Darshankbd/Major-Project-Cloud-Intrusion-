import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Zap, 
  Activity, 
  FileCheck, 
  Lock, 
  ArrowRight,
  Database,
  BarChart3,
  Layers,
  CheckCircle2,
  Calendar,
  Sparkles,
  UserCheck,
  Shield,
  KeyRound
} from 'lucide-react';
import { StepNavigationFooter } from '../components/StepProgress';

export function Home({ setCurrentPage, user, setUser, onOpenAuth }) {
  const handleQuickLogin = (role) => {
    if (role === 'Admin') {
      setUser({
        username: 'admin_darshan',
        role: 'Admin',
        email: 'admin@cloudids.local'
      });
    } else {
      setUser({
        username: 'analyst_operator',
        role: 'Security Analyst',
        email: 'analyst@cloudids.local'
      });
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner with Role Switcher */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0f172a] via-[#0a0e17] to-[#06090e] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold">
                Project Code: BIS786
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                Dept of ISE, SKIT
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Cloud Intrusion Detection System{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                (Cloud-IDS ML v2.5)
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-mono leading-relaxed">
              Multi-model intrusion detection pipeline for cloud virtual networks with automated feature extraction, Random Forest classification, and real-time firewall mitigation.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('datasets')}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 group cursor-pointer"
              >
                <span>Launch Pipeline (Step 1)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentPage('sandbox')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-rose-500/30 text-rose-300 font-mono text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-rose-400" />
                <span>Exploit Sandbox</span>
              </button>
            </div>
          </div>

          {/* Quick Role Selection / Login Box */}
          <div className="w-full lg:w-80 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Active Profile</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                Active
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="text-white font-bold text-sm flex items-center justify-between">
                <span>{user?.username || 'admin_darshan'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{user?.email || 'admin@cloudids.local'}</div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Switch Role:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickLogin('Admin')}
                  className={`p-2 rounded-lg text-center transition-all border cursor-pointer ${
                    user?.role === 'Admin' 
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Administrator
                </button>
                <button
                  onClick={() => handleQuickLogin('Security Analyst')}
                  className={`p-2 rounded-lg text-center transition-all border cursor-pointer ${
                    user?.role === 'Security Analyst' 
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-bold' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Analyst
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
            <button
              onClick={() => setCurrentPage('datasets')}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <span className="text-cyan-400 font-bold block">Step 1: Ingestion</span>
              <p className="text-[11px] text-slate-400">NSL-KDD, CICIDS2017, UNSW-NB15 datasets.</p>
            </button>
            <button
              onClick={() => setCurrentPage('train')}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <span className="text-purple-400 font-bold block">Step 2: Model Training</span>
              <p className="text-[11px] text-slate-400">100-Tree Random Forest vs Decision Tree.</p>
            </button>
            <button
              onClick={() => setCurrentPage('graphs')}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <span className="text-emerald-400 font-bold block">Step 3: Graphs & Curves</span>
              <p className="text-[11px] text-slate-400">50-Epoch loss & accuracy progression.</p>
            </button>
            <button
              onClick={() => setCurrentPage('sandbox')}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <span className="text-rose-400 font-bold block">Step 4: Exploit Sandbox</span>
              <p className="text-[11px] text-slate-400">Simulate DoS, Probe, R2L, U2R live vectors.</p>
            </button>
            <button
              onClick={() => setCurrentPage('reports')}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 text-left transition-all space-y-1 cursor-pointer"
            >
              <span className="text-amber-400 font-bold block">Step 5: Audit & PDF</span>
              <p className="text-[11px] text-slate-400">Dynamic PDF report & architecture models.</p>
            </button>
          </div>
        </div>
      </section>

      {/* Stepper Navigation */}
      <StepNavigationFooter
        currentStep="home"
        setCurrentStep={setCurrentPage}
        nextStep="datasets"
        nextStepTitle="Proceed to Step 1: Datasets ➔"
      />
    </div>
  );
}
