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
import { EvaluatorGuide, StepNavigationFooter } from '../components/StepProgress';

export function Home({ setCurrentPage, user, setUser, onOpenAuth }) {
  const [activeTab, setActiveTab] = useState('overview');

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
      {/* Evaluator Presentation Guide Script for Step 0 */}
      <EvaluatorGuide
        stepNumber="0"
        title="Role Authentication & Scope Introduction"
        whatToSay='"Good morning respected evaluators. Our project develops an ML-based Cloud Intrusion Detection System for cloud virtual networks. We begin by authenticating with Role-Based Access Control (RBAC) to separate Administrator model management from Security Analyst verification."'
        technicalHighlight="RBAC controls separation of privilege. Administrators can upload datasets, retrain Scikit-Learn models, and export .joblib artifacts. Security Analysts perform exploit verification and audit compliance."
      />

      {/* Hero Banner with Role Switcher */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0f172a] via-[#0a0e17] to-[#06090e] p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold">
                Project Code: BIS786
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                Dept of ISE, SKIT 2026–2027
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Cloud Intrusion Detection System{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                (Cloud-IDS ML v2.5)
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-mono leading-relaxed">
              Synchronous 5-step detection pipeline: Benchmark Ingestion (NSL-KDD, CICIDS2017) ➔ 100-Tree Random Forest Ensemble ➔ 50-Epoch Loss Curves ➔ Red-Team Exploit Sandbox ➔ Dynamic ReportLab PDF Compliance.
            </p>
          </div>

          {/* Quick Role Selection / Login Box for Evaluators */}
          <div className="w-full lg:w-80 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Active Operator Profile</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Logged In
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
              <span className="text-[10px] uppercase text-slate-500 font-bold block">Switch Role for Demo:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickLogin('Admin')}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    user?.role === 'Admin' 
                      ? 'bg-purple-950/60 border-purple-500 text-purple-200 font-bold' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  🛡️ Administrator
                </button>
                <button
                  onClick={() => handleQuickLogin('Security Analyst')}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    user?.role === 'Security Analyst' 
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-bold' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  🔍 Analyst
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Step Synchronous Flow Cards Overview */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">
            System Synchronous Execution Pipeline:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">Step 1: Ingestion</span>
              <p className="text-[11px] text-slate-400">Profile NSL-KDD, CICIDS2017, UNSW-NB15 datasets.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-purple-400 font-bold block">Step 2: Model Training</span>
              <p className="text-[11px] text-slate-400">100-Tree Random Forest vs Decision Tree fitting.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">Step 3: Graphs & Curves</span>
              <p className="text-[11px] text-slate-400">50-Epoch loss convergence & confusion matrix.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-rose-400 font-bold block">Step 4: Exploit Sandbox</span>
              <p className="text-[11px] text-slate-400">Simulate DoS, Probe, R2L, U2R live vectors.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">Step 5: Audit & PDF</span>
              <p className="text-[11px] text-slate-400">ReportLab executive PDF & Review 2 Roadmap.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Synchronous Stepper Navigation Button */}
      <StepNavigationFooter
        currentStep="home"
        setCurrentStep={setCurrentPage}
        nextStep="datasets"
        nextStepTitle="Step 1: Dataset Ingestion & Preprocessing"
      />
    </div>
  );
}
