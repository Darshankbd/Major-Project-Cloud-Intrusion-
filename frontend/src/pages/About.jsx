import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Layers, 
  GitBranch, 
  CheckCircle2, 
  ShieldAlert, 
  Network, 
  Cpu, 
  FileText 
} from 'lucide-react';

export function About() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8 py-4">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Project Documentation & Architecture
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Cloud Intrusion Detection System using Machine Learning (BIS786 • Dept of ISE, SKIT 2026-2027)
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Goals
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'modules'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            9 System Modules
          </button>
          <button
            onClick={() => setActiveTab('diagrams')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'diagrams'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            UML & Design Models
          </button>
        </div>
      </div>

      {/* Tab: Overview & Objectives */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem Statement Card */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <ShieldAlert className="w-6 h-6" />
                <h2 className="text-lg font-bold text-white">1.2 Problem Statement</h2>
              </div>
              <blockquote className="p-4 rounded-xl bg-slate-950/80 border-l-4 border-cyan-500 text-sm text-slate-300 italic">
                “To develop an ML-based Cloud Intrusion Detection System that detects known, unknown, and abnormal attacks with fewer false alarms, providing timely alerts to protect cloud resources.”
              </blockquote>
              <p className="text-xs text-slate-400 leading-relaxed">
                Traditional signature-based IDS solutions fail to defend dynamic high-throughput multi-tenant cloud networks against zero-day exploits, port sweeps, botnets, and DDoS cascades.
              </p>
            </div>

            {/* Objectives Card */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <Target className="w-6 h-6" />
                <h2 className="text-lg font-bold text-white">1.3 Project Objectives</h2>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Implement an ML-based IDS engine for high-velocity real-time attack detection.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Improve detection accuracy (&gt;98.6%) and minimize false positive alarm rates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Validate against standardized benchmarks: NSL-KDD, CICIDS2017, and UNSW-NB15.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Synthesize automated response rules for Linux iptables and AWS Security Groups.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Abstract */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h2 className="text-sm font-bold font-mono text-cyan-400 uppercase tracking-wider mb-2">Executive Abstract</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cloud computing environments have become critical digital infrastructure, yet their distributed, multi-tenant nature exposes them to severe security threats such as Distributed Denial of Service (DDoS), unauthorized intrusions, botnet infiltration, and brute-force attacks. This project presents a Cloud Intrusion Detection System (Cloud-IDS) using Machine Learning, engineered to inspect network traffic flows, identify abnormal telemetry patterns, and accurately classify network activity into normal operations or specific threat categories in real time.
            </p>
          </div>
        </div>
      )}

      {/* Tab: 9 System Modules */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: '1', title: 'Cloud Data Collection', desc: 'Ingests network flow logs, system metrics, firewall events, and user activity from cloud environments.' },
            { id: '2', title: 'Data Preprocessing', desc: 'Cleans raw records, imputes missing values, eliminates noise, and standardizes data formats.' },
            { id: '3', title: 'Feature Engineering', desc: 'Extracts critical behavioral metrics like connection duration, packet frequencies, and protocol flags.' },
            { id: '4', title: 'ML Detection Engine', desc: 'Applies 100-tree Random Forest and Decision Tree classifiers to infer benign vs threat categories.' },
            { id: '5', title: 'Threat Analysis & Scoring', desc: 'Calculates anomaly confidence probabilities and assigns severity tiers (Low, Medium, High, Critical).' },
            { id: '6', title: 'Alert & Notification', desc: 'Dispatches real-time security alerts to the SOC console, SIEM feeds, and operator logs.' },
            { id: '7', title: 'Response & Mitigation', desc: 'Synthesizes perimeter defense commands (iptables DROP and AWS NACL 50 rules).' },
            { id: '8', title: 'Monitoring & Visualization', desc: 'Presents interactive attack telemetry graphs, threat trends, and live system health status.' },
            { id: '9', title: 'Model Training & Evaluation', desc: 'Performs continuous model retraining on historical PCAPs with 50-epoch curve tracking.' },
          ].map((mod) => (
            <div key={mod.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/40">
                  {mod.id}
                </span>
                <h3 className="text-sm font-bold text-white">{mod.title}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab: UML Models */}
      {activeTab === 'diagrams' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <GitBranch className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Fig 3.1: Data Flow Architecture (DFD Level 0 & 1)</h3>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
                <div>[Cloud Traffic] ➔ (1.0 Data Collection) ➔ (2.0 Preprocessing)</div>
                <div className="pl-4 text-cyan-400">➔ (3.0 Feature Extraction) ➔ (4.0 ML Engine)</div>
                <div className="pl-8 text-emerald-400">➔ (5.0 Alert Generation) ➔ [SOC Dashboard / Firewall]</div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Network className="w-5 h-5" />
                <h3 className="text-sm font-bold text-white">Fig 3.3: Class Diagram Entities</h3>
              </div>
              <div className="p-4 bg-slate-950 rounded-lg font-mono text-[11px] text-slate-300 space-y-1">
                <div>• <span className="text-white font-semibold">User:</span> Admin, Analyst (RBAC)</div>
                <div>• <span className="text-cyan-400 font-semibold">TrafficData:</span> protocol, duration, src_bytes, dst_bytes</div>
                <div>• <span className="text-emerald-400 font-semibold">DetectionEngine:</span> MLModel, predict(), getConfidence()</div>
                <div>• <span className="text-rose-400 font-semibold">Alert:</span> attackType, severity, firewallRule</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
