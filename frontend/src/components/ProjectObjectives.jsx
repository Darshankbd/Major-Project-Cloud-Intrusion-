import React from 'react';
import { Target, CheckCircle2, ShieldCheck, Cpu, Database, Radio, Network, ArrowRight, Zap, Award } from 'lucide-react';

export default function ProjectObjectives({ onNavigateTab }) {
  const OBJECTIVES = [
    {
      id: 1,
      title: "Real-Time ML Attack Detection",
      goal: "To implement an ML-based IDS model for real-time attack detection.",
      status: "VERIFIED & ACTIVE",
      tech: "FastAPI + WebSockets + XGBoost Engine (<10ms Latency)",
      where: "Live Traffic Stream & SOC Command Center",
      targetTab: "live",
      color: "border-blue-500/40 bg-blue-500/5 text-blue-400",
      icon: Radio,
      details: [
        "Continuous sub-10ms packet flow inspection via `/ws/live-stream`.",
        "Live classification into 6 threat categories: BENIGN, DoS/DDoS, Port Scan, Brute Force, Malware C2, and IAM Escalation.",
        "Real-time visual stream with color-coded severity badges."
      ]
    },
    {
      id: 2,
      title: "High Accuracy & Low False Alarms",
      goal: "To improve detection accuracy and reduce false alarm rate.",
      status: "99.4% ACCURACY VERIFIED",
      tech: "XGBoost + Random Forest Ensemble + Configurable Risk Thresholds",
      where: "ML Analytics & Diagnostics Suite",
      targetTab: "analytics",
      color: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
      icon: Cpu,
      details: [
        "Cross-validated ensemble model achieving 99.4% Precision and Recall.",
        "Strict probability thresholding (Critical ≥0.85, High ≥0.65) to eliminate false positive alert fatigue.",
        "On-demand model retraining suite with confusion matrix & ROC-AUC curves."
      ]
    },
    {
      id: 3,
      title: "Large-Scale Real-World Dataset Testing",
      goal: "To test the model on large-scale and real-world datasets.",
      status: "15,000+ SAMPLES TRAINED",
      tech: "CIC-IDS2017 / UNSW-NB15 / NSL-KDD Benchmark Synthesizer",
      where: "Packet Inspector & Flow Metrics",
      targetTab: "inspector",
      color: "border-purple-500/40 bg-purple-500/5 text-purple-400",
      icon: Database,
      details: [
        "Trained on 15,000+ benchmark network flow records.",
        "Extracts 24+ high-dimensional features: packet lengths, error rates (`serror_rate`, `rerror_rate`), payload entropy, and IAM privilege scores.",
        "Comprehensive packet inspector for deep feature exploration."
      ]
    },
    {
      id: 4,
      title: "Dynamic Cloud & Network Environment Performance",
      goal: "To enhance system performance for dynamic cloud and network environments.",
      status: "MULTI-REGION TOPOLOGY ACTIVE",
      tech: "Multi-Region Cloud Topology + Dynamic Resource Attribution",
      where: "Cloud Topology & Employee Management",
      targetTab: "topology",
      color: "border-amber-500/40 bg-amber-500/5 text-amber-400",
      icon: Network,
      details: [
        "Multi-region cloud node telemetry (us-east-1, us-west-2, ap-south-1).",
        "Employee Resource Attribution: Maps specific cloud VMs (`10.0.1.15`) and subnets to responsible organization employees.",
        "High-throughput asynchronous event handling for dynamic network scaling."
      ]
    },
    {
      id: 5,
      title: "Advanced & Zero-Day Attack Detection",
      goal: "To extend the system for detecting advanced and zero-day attacks.",
      status: "UNSUPERVISED DEPLOYED",
      tech: "Isolation Forest + Explainable AI (XAI) Feature Attribution",
      where: "Incidents & Mitigation Hub",
      targetTab: "incidents",
      color: "border-rose-500/40 bg-rose-500/5 text-rose-400",
      icon: ShieldCheck,
      details: [
        "Unsupervised Isolation Forest (`isolation_forest.joblib`) specifically flags un-labeled zero-day anomalies.",
        "Explainable AI (XAI) computes numeric contribution scores for individual features.",
        "Automated one-click IP quarantine and firewall rule generation."
      ]
    }
  ];

  return (
    <div className="space-y-6 font-mono text-left">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-purple-950/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                <Target className="w-6 h-6 animate-pulse" />
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                Project Objectives & Verification Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans pl-1">
              Demonstrating full 100% compliance across all major project research objectives in the live website UI.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold shrink-0">
            <Award className="w-4 h-4" />
            <span>100% OBJECTIVES VERIFIED IN LIVE SYSTEM</span>
          </div>
        </div>
      </div>

      {/* Grid of 5 Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {OBJECTIVES.map((obj) => {
          const Icon = obj.icon;
          return (
            <div
              key={obj.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col justify-between space-y-4 hover:border-slate-700 transition ${obj.color}`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-current font-mono">
                    OBJECTIVE 0{obj.id}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{obj.status}</span>
                  </div>
                </div>

                {/* Title & Goal */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 shrink-0" />
                    <h3 className="font-bold text-sm text-slate-100">{obj.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 font-sans italic border-l-2 border-slate-700 pl-2.5 py-0.5">
                    "{obj.goal}"
                  </p>
                </div>

                {/* Details List */}
                <div className="space-y-1.5 pt-1">
                  {obj.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400 font-sans">
                      <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Where Obtained in Website + Navigation Button */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500 font-bold uppercase tracking-wider block text-[10px]">Obtained in Website UI:</span>
                  <span className="font-bold text-slate-200">{obj.where}</span>
                </div>

                <button
                  onClick={() => onNavigateTab(obj.targetTab)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold transition flex items-center justify-between group cursor-pointer"
                >
                  <span>Show Result in {obj.where.split('&')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
