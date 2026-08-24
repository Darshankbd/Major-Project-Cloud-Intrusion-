import React from 'react';
import { 
  Shield, 
  Home, 
  Database, 
  Cpu, 
  BarChart3, 
  Bug, 
  FileText,
  Radio, 
  User, 
  LogOut,
  Sparkles
} from 'lucide-react';

export function Navbar({ 
  currentPage, 
  setCurrentPage, 
  user, 
  onOpenAuth, 
  onLogout 
}) {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'datasets', label: 'Datasets & Preprocessing', icon: Database },
    { id: 'train', label: 'ML Training Suite', icon: Cpu },
    { id: 'graphs', label: 'Evaluation & Graphs', icon: BarChart3 },
    { id: 'sandbox', label: 'Exploit Sandbox', icon: Bug },
    { id: 'reports', label: 'Phase 1 Audit Report', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b13]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-950/20">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/30">
            <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                Cloud Intrusion Detection System
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold">
                Phase 1 / Review 1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide">
              ML Security Operations & Threat Classification • Dept of ISE, SKIT
            </p>
          </div>
        </div>

        {/* Right Header Utilities */}
        <div className="flex items-center gap-3">
          {/* Phase Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Review 1: Ready</span>
          </div>

          {/* User Sign In / Role Status */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-mono font-medium text-slate-200">{user.username}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {user.role}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-md transition-colors shadow-sm shadow-cyan-500/20"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto py-1">
        <ul className="flex items-center gap-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
