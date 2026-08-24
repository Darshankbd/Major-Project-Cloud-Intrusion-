import React from 'react';
import { 
  Zap, 
  Cpu, 
  Terminal, 
  FileText, 
  ShieldAlert, 
  Download,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export function Features({ setCurrentPage }) {
  const features = [
    {
      id: 'telemetry',
      icon: Zap,
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-orange-500/5',
      title: 'Real-time Traffic Telemetry',
      desc: 'Monitors packet duration, bytes transferred, protocol types, and flags in high-speed cloud network streams.',
      actionLabel: 'View Live Dashboard',
      target: 'dashboard'
    },
    {
      id: 'ml_compare',
      icon: Cpu,
      iconColor: 'text-cyan-400',
      bgGlow: 'from-cyan-500/10 to-blue-500/5',
      title: 'Automated ML Comparison',
      desc: 'Evaluates Accuracy, Precision, Recall, and F1 across 5+ algorithms (Random Forest, Decision Tree, SVM, KNN, Naive Bayes).',
      actionLabel: 'Open Training Suite',
      target: 'train'
    },
    {
      id: 'sandbox',
      icon: Terminal,
      iconColor: 'text-rose-400',
      bgGlow: 'from-rose-500/10 to-pink-500/5',
      title: 'Zero-Day Exploit Sandbox',
      desc: 'Allows red-team operators to craft custom raw packet payloads and observe real-time AI classification response.',
      actionLabel: 'Launch Sandbox',
      target: 'sandbox'
    },
    {
      id: 'reports',
      icon: FileText,
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-teal-500/5',
      title: 'PDF & CSV Audit Reports',
      desc: 'Compiles downloadable executive PDF audit reports dynamically using Python ReportLab engine.',
      actionLabel: 'Generate Reports',
      target: 'reports'
    },
    {
      id: 'alerts',
      icon: ShieldAlert,
      iconColor: 'text-purple-400',
      bgGlow: 'from-purple-500/10 to-indigo-500/5',
      title: 'Automated SOC Alerts',
      desc: 'Triggers actionable mitigation instructions including Linux iptables and AWS Security Group JSON rules.',
      actionLabel: 'Inspect History',
      target: 'history'
    },
    {
      id: 'download',
      icon: Download,
      iconColor: 'text-sky-400',
      bgGlow: 'from-sky-500/10 to-cyan-500/5',
      title: 'Download Trained Model',
      desc: 'Export serialized .joblib models directly to deploy them into edge gateways or live Kubernetes sidecars.',
      actionLabel: 'Model Export Suite',
      target: 'train'
    }
  ];

  return (
    <div className="space-y-10 py-6">
      {/* Title Header matching Fig 4.5.2 */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          System Features & Capabilities
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Enterprise cybersecurity functionality built for SOC analysts and cloud administrators.
        </p>
      </div>

      {/* 6 Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className={`relative p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 bg-gradient-to-br ${f.bgGlow} bg-[#0c1220] transition-all flex flex-col justify-between group shadow-xl`}
            >
              <div className="space-y-4">
                <div className={`p-3 rounded-xl bg-slate-900/80 border border-slate-800 w-fit ${f.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(f.target)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>{f.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
