import React from 'react';

export function ThreatBadge({ severity, label }) {
  const sev = severity || 'Low';
  
  const getStyles = () => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20';
      case 'high':
        return 'bg-red-950/80 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20';
      case 'medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20';
      case 'low':
      case 'normal':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${getStyles()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {label || sev}
    </span>
  );
}

export function AttackBadge({ attackType }) {
  const type = attackType || 'Normal';
  const getBadgeColor = () => {
    switch (type.toUpperCase()) {
      case 'DOS':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'PROBE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'R2L':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'U2R':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${getBadgeColor()}`}>
      {type}
    </span>
  );
}
