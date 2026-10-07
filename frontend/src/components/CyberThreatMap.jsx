import React from 'react';
import { Globe, Zap, Radio } from 'lucide-react';

const COUNTRIES = [
  { name: 'United States', x: 22, y: 35, flag: '🇺🇸' },
  { name: 'Germany', x: 50, y: 28, flag: '🇩🇪' },
  { name: 'Russia', x: 70, y: 25, flag: '🇷🇺' },
  { name: 'China', x: 78, y: 38, flag: '🇨🇳' },
  { name: 'India', x: 68, y: 45, flag: '🇮🇳' },
  { name: 'Brazil', x: 35, y: 70, flag: '🇧🇷' },
  { name: 'Japan', x: 86, y: 38, flag: '🇯🇵' },
];

export default function CyberThreatMap({ liveLogs }) {
  const activeAttacks = liveLogs.filter(l => l.severity === 'CRITICAL' || l.severity === 'HIGH').slice(0, 6);

  return (
    <div className="glass-panel p-6 lg:p-8 space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            Global Cyber Threat Telemetry Map
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial visualization of incoming attack vectors targeting cloud VPC datacenters.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="badge badge-critical flex items-center gap-1 px-3 py-1 text-xs">
            <Zap className="w-3.5 h-3.5" /> {activeAttacks.length} Active Attack Beams
          </span>
        </div>
      </div>

      <div className="relative w-full h-[400px] lg:h-[440px] bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 50">
          <defs>
            <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#334155" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="50" fill="url(#grid)" />
        </svg>

        <div className="absolute left-[28%] top-[38%] text-center z-10">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/40 border-2 border-blue-400 animate-ping absolute" />
            <div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-white shadow-[0_0_20px_#3b82f6]" />
          </div>
          <span className="text-xs font-mono font-bold text-blue-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-blue-500/40 mt-2 inline-block shadow-lg">
            AWS us-east-1 (Target Datacenter)
          </span>
        </div>

        {COUNTRIES.map((c, i) => {
          const hasActiveThreat = activeAttacks.some(a => a.geo_country === c.name);
          return (
            <div
              key={i}
              className="absolute z-10 transition-all duration-300"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <div className="relative flex items-center justify-center group">
                {hasActiveThreat && (
                  <div className="w-7 h-7 rounded-full bg-rose-500/60 animate-ping absolute" />
                )}
                <div className={`w-4 h-4 rounded-full border-2 ${
                  hasActiveThreat ? 'bg-rose-500 border-white shadow-[0_0_15px_#f43f5e]' : 'bg-emerald-400 border-slate-900'
                }`} />

                <div className="absolute bottom-5 hidden group-hover:block whitespace-nowrap bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 px-3 py-1.5 rounded-lg shadow-xl z-20">
                  {c.flag} {c.name} {hasActiveThreat ? '(Active Attacker)' : '(Monitored)'}
                </div>
              </div>
            </div>
          );
        })}

        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 50">
          {activeAttacks.map((attack, i) => {
            const country = COUNTRIES.find(c => c.name === attack.geo_country) || COUNTRIES[2];
            return (
              <g key={i}>
                <line
                  x1={country.x}
                  y1={country.y}
                  x2={28}
                  y2={38}
                  stroke="#ef4444"
                  strokeWidth="0.5"
                  strokeDasharray="1.5, 1.5"
                  className="animate-pulse"
                />
                <circle cx={28} cy={38} r="1" fill="#ef4444" className="animate-ping" />
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-mono shadow-lg">
          <div className="flex items-center gap-3">
            <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="text-slate-400 font-semibold">Geo Telemetry:</span>
            <span className="text-rose-300 font-bold">
              {activeAttacks[0] ? `${activeAttacks[0].geo_country} → ${activeAttacks[0].prediction}` : 'Monitoring Global Traffic Streams'}
            </span>
          </div>
          <span className="text-slate-500 text-xs font-medium">Real-time Latency: 12ms</span>
        </div>
      </div>
    </div>
  );
}
