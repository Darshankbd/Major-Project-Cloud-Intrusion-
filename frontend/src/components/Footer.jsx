import React from 'react';
import { Shield, Lock, Server } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-[#06090e] py-8 text-xs text-slate-400 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>
            <b>Cloud Intrusion Detection System (Cloud-IDS ML)</b> • Dept of ISE, SKIT 2026-2027
          </span>
        </div>
        <div className="flex items-center gap-6 text-slate-500">
          <span className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            SOC Node: Active (127.0.0.1:5000)
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            Scikit-Learn Ensemble Engine
          </span>
        </div>
      </div>
    </footer>
  );
}
