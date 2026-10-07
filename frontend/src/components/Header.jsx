import React from 'react';
import { Shield, Download, Play, Square, Palette, UserCheck, LogOut, User } from 'lucide-react';
import { getReportDownloadUrl } from '../services/api';

const THEMES = [
  { id: 'midnight', label: '🌌 Midnight', color: '#3b82f6' },
  { id: 'matrix', label: '🟢 Matrix', color: '#10b981' },
  { id: 'synthwave', label: '🟣 Synthwave', color: '#ec4899' },
  { id: 'redalert', label: '🔴 Red Alert', color: '#ef4444' },
  { id: 'solarized', label: '⚡ Solarized', color: '#2aa198' },
];

const PERSONAS = [
  { email: 'admin@cloudguard.io', name: 'Sarah Jenkins (Org Admin)', role: 'ORG_ADMIN' },
  { email: 'alice@cloudguard.io', name: 'Alice Smith (DevOps Lead)', role: 'EMPLOYEE' },
  { email: 'bob@cloudguard.io', name: 'Bob Jones (Auth Specialist)', role: 'EMPLOYEE' },
  { email: 'charlie@cloudguard.io', name: 'Charlie Brown (Data Engineer)', role: 'EMPLOYEE' },
];

export default function Header({ 
  isSimulating, 
  onToggleSimulator, 
  generatedCount, 
  threatCount, 
  currentTheme, 
  onThemeChange,
  currentUser,
  onPersonaSwitch,
  onLogout
}) {
  return (
    <header className="glass-panel mb-6 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 font-mono">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <Shield className="w-7 h-7 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
              Cloud Intrusion <span className="text-blue-400">Detection System</span>
            </h1>
            <span className="badge badge-low text-[10px] py-0.5">ENTERPRISE EDITION</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloud Intrusion Detection & Employee Security Governance Platform
          </p>
        </div>
      </div>

      {/* Control Buttons & User Profile */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Active Session User Info & Persona Quick Switcher */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs">
          <UserCheck className="w-4 h-4 text-blue-400" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentUser?.role === 'ORG_ADMIN' ? '🛡️ ORG ADMIN' : '💻 EMPLOYEE'}
            </span>
            <select
              value={currentUser?.email || 'admin@cloudguard.io'}
              onChange={(e) => onPersonaSwitch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              {PERSONAS.map(p => (
                <option key={p.email} value={p.email}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Theme Switcher */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
          <Palette className="w-4 h-4 text-purple-400" />
          <select
            value={currentTheme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-slate-200 focus:outline-none cursor-pointer"
          >
            {THEMES.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Live Traffic Simulator Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <div className={`pulse-dot ${isSimulating ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <span className="text-slate-300 font-bold">
            {isSimulating ? 'SIMULATOR ACTIVE' : 'PAUSED'}
          </span>
        </div>

        {/* Start / Stop Simulator Button */}
        <button
          onClick={onToggleSimulator}
          className={`btn ${isSimulating ? 'btn-danger' : 'btn-primary'} text-xs py-2`}
          title={isSimulating ? "Pause Traffic Simulator" : "Start Traffic Simulator"}
        >
          {isSimulating ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        {/* Export PDF Report */}
        <a
          href={getReportDownloadUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary text-xs py-2"
          title="Export PDF Report"
        >
          <Download className="w-3.5 h-3.5" />
          PDF
        </a>

        {/* Log Out Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition cursor-pointer"
          title="Sign out of current session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
