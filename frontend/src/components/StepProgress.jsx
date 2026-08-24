import React from 'react';
import { 
  Database, 
  Cpu, 
  BarChart3, 
  Bug, 
  FileText, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  UserCheck,
  Home
} from 'lucide-react';

export function StepProgressHeader({ currentStep, setCurrentStep, userRole }) {
  const steps = [
    { id: 'home', number: '0', title: 'Auth & Overview', icon: Home, desc: 'Scope & Role Portal' },
    { id: 'datasets', number: '1', title: 'Dataset Ingestion', icon: Database, desc: 'Profiling & Preprocessing' },
    { id: 'train', number: '2', title: 'ML Training Suite', icon: Cpu, desc: 'Ensemble Fitting & Comparison' },
    { id: 'graphs', number: '3', title: 'Evaluation & Graphs', icon: BarChart3, desc: '50-Epoch Convergence Curves' },
    { id: 'sandbox', number: '4', title: 'Exploit Verification', icon: Bug, desc: 'Live Attack Classification' },
    { id: 'reports', number: '5', title: 'Phase 1 Audit Report', icon: FileText, desc: 'PDF & Roadmap Milestone' },
  ];

  const currentIdx = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="bg-[#0b101b] border-b border-slate-800/80 px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
              SYNCHRONOUS EVALUATION WORKFLOW
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Step {currentIdx} of 5 • {steps[currentIdx]?.title}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Current Role:</span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              userRole === 'Admin' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}>
              {userRole === 'Admin' ? '🛡️ Administrator' : '🔍 Security Analyst'}
            </span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`p-2 rounded-xl text-left transition-all border flex items-center gap-2 relative ${
                  isCurrent
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                    : isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/40 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:bg-slate-900/60'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : s.number}
                </div>

                <div className="min-w-0">
                  <div className={`text-[11px] font-bold font-mono truncate ${
                    isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                  }`}>
                    {s.title}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 truncate hidden md:block">
                    {s.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StepNavigationFooter({ currentStep, setCurrentStep, nextStep, prevStep, currentStepTitle, nextStepTitle }) {
  return (
    <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
      {prevStep ? (
        <button
          onClick={() => setCurrentStep(prevStep)}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <span>⏮ Previous: Step {currentStep === 'reports' ? '4' : currentStep === 'sandbox' ? '3' : currentStep === 'graphs' ? '2' : '1'}</span>
        </button>
      ) : <div />}

      {nextStep && (
        <button
          onClick={() => setCurrentStep(nextStep)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 group"
        >
          <span>Proceed to Next: {nextStepTitle}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}

export function EvaluatorGuide({ stepNumber, title, whatToSay, technicalHighlight }) {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#0c1322] border border-cyan-500/30 text-xs font-mono space-y-2 shadow-lg mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>STEP {stepNumber} EVALUATOR EXPLANATION SCRIPT</span>
        </div>
        <span className="text-[10px] text-slate-400 font-normal">Use this to explain synchronously to teachers</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
        <div className="space-y-1">
          <span className="text-cyan-300 font-bold block">🎙️ What to explain to Evaluators:</span>
          <p className="text-[11px] leading-relaxed text-slate-300">{whatToSay}</p>
        </div>
        <div className="space-y-1">
          <span className="text-emerald-400 font-bold block">⚙️ Technical Highlights to emphasize:</span>
          <p className="text-[11px] leading-relaxed text-slate-300">{technicalHighlight}</p>
        </div>
      </div>
    </div>
  );
}
