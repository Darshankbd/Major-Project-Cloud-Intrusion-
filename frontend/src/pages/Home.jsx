import React from 'react';
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
  Sparkles
} from 'lucide-react';

export function Home({ setCurrentPage }) {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section matching Fig 4.5.1 */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#0f172a]/90 via-[#0a0e17] to-[#06090e] p-8 md:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Phase 1 Review: Operational Baseline</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dept of ISE, SKIT (BIS786)</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Cloud Intrusion Detection System{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Powered by Machine Learning
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base text-slate-300 leading-relaxed">
            Multi-model network flow inspection, automated data preprocessing (NSL-KDD, CICIDS2017, UNSW-NB15), Random Forest & Decision Tree classification, interactive 50-epoch convergence curves, and on-demand executive PDF audit reports.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setCurrentPage('train')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 group"
            >
              <Cpu className="w-4 h-4" />
              <span>Open ML Training Suite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentPage('graphs')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-semibold text-sm rounded-xl transition-all"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>View Performance & Graphs</span>
            </button>

            <button
              onClick={() => setCurrentPage('sandbox')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900/90 hover:bg-slate-800 border border-rose-500/30 text-rose-300 font-semibold text-sm rounded-xl transition-all"
            >
              <Terminal className="w-4 h-4 text-rose-400" />
              <span>Exploit Sandbox</span>
            </button>
          </div>
        </div>

        {/* Floating Quick Stats */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-cyan-400">98.6%</div>
            <div className="text-xs text-slate-400 mt-0.5">Classification Accuracy</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-emerald-400">&lt; 0.4%</div>
            <div className="text-xs text-slate-400 mt-0.5">False Alarm Rate (FAR)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-purple-400">100 Trees</div>
            <div className="text-xs text-slate-400 mt-0.5">Random Forest Bagging</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-2xl font-bold font-mono text-amber-400">5 Classes</div>
            <div className="text-xs text-slate-400 mt-0.5">Normal, DoS, Probe, R2L, U2R</div>
          </div>
        </div>
      </section>

      {/* Phase 1 Completion vs Review 2 Roadmap Comparison */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Project Scope & Two-Phase Roadmap</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">Structured delivery across Academic Reviews 1 and 2</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phase 1 Scope (Completed) */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Phase 1 / Review 1 Deliverables (Active)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                100% Complete
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Benchmark Dataset Profiling:</b> Ingestion & cleaning of NSL-KDD, CICIDS2017, and UNSW-NB15 with zero missing values.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Supervised ML Training Suite:</b> Multi-model fitting (Random Forest, Decision Tree, SVM, KNN, Naive Bayes) with 80/20 holdout split.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Evaluation & Convergence Curves:</b> 50-epoch Loss & Accuracy progression (Fig 4.2), Confusion Matrix, and Gini Feature Attribution.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Model Serialization (.joblib):</b> Web export of serialized scikit-learn models for standalone inference deployment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><b>Executive PDF Reports:</b> Dynamic Python ReportLab audit compilation with mathematical formulation matrices.</span>
              </li>
            </ul>
          </div>

          {/* Review 2 Roadmap */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-xl space-y-4 opacity-90">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono text-sm">
                <Calendar className="w-5 h-5" />
                <span>Phase 2 / Review 2 Roadmap (Future Scope)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold">
                Planned
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">➔</span>
                <span><b>Live Kernel eBPF Packet Capture:</b> Transition from sample datasets to full raw gigabit socket sniffing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">➔</span>
                <span><b>Microservices Dockerization:</b> Packaging backend ML engine, Redis pub/sub queue, and React SPA into Docker containers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">➔</span>
                <span><b>Deep Learning & GNN Ensembles:</b> Integration of LSTM temporal sequences and Graph Neural Networks for distributed botnet defense.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">➔</span>
                <span><b>Multi-Cloud Automated Orchestration:</b> Automated cloud remediation across AWS IAM, GCP Cloud Armor, and Azure NSG policies.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
