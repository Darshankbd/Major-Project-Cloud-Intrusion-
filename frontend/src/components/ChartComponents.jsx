import React, { useState } from 'react';

// 1. Interactive 50-Epoch Loss Curve Chart (Native SVG + Glows)
export function LossCurveChart({ epochs, trainLoss, valLoss }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const ep = epochs || Array.from({ length: 50 }, (_, i) => i + 1);
  const tLoss = trainLoss || Array.from({ length: 50 }, (_, i) => Math.max(0.182, 1.9 * Math.exp(-0.06 * (i + 1)) + 0.12));
  const vLoss = valLoss || Array.from({ length: 50 }, (_, i) => Math.max(0.431, 1.6 * Math.exp(-0.05 * (i + 1)) + 0.38));

  // Map 50 points into SVG viewBox [40, 20] to [380, 150]
  const width = 380;
  const height = 150;
  const paddingLeft = 40;
  const paddingTop = 15;
  const paddingBottom = 25;
  const graphW = width - paddingLeft;
  const graphH = height - paddingTop - paddingBottom;

  const maxVal = 2.0;
  const getY = (val) => paddingTop + graphH - (val / maxVal) * graphH;
  const getX = (idx) => paddingLeft + (idx / (ep.length - 1)) * (graphW - 10);

  const trainPath = tLoss.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`).join(' ');
  const valPath = vLoss.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`).join(' ');

  return (
    <div className="relative w-full h-full min-h-[220px] flex flex-col justify-between select-none">
      <div className="flex items-center justify-between text-xs font-mono mb-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> Training Loss (0.182)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-0.5 border-b border-dashed border-rose-400 inline-block"></span> Validation Loss (0.431)
          </span>
        </div>
        {hoverIdx !== null && (
          <span className="text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            Epoch {hoverIdx + 1}: Train={tLoss[hoverIdx]?.toFixed(3)} | Val={vLoss[hoverIdx]?.toFixed(3)}
          </span>
        )}
      </div>

      <div className="relative flex-1 bg-slate-950/80 rounded-xl border border-slate-800 p-2 overflow-hidden">
        <svg viewBox="0 0 400 160" className="w-full h-full">
          {/* Grid lines */}
          <line x1="40" y1="20" x2="390" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="55" x2="390" y2="55" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="90" x2="390" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="125" x2="390" y2="125" stroke="#1e293b" strokeDasharray="3 3" />

          {/* Axes */}
          <line x1="40" y1="15" x2="40" y2="135" stroke="#475569" strokeWidth="1" />
          <line x1="40" y1="135" x2="390" y2="135" stroke="#475569" strokeWidth="1" />

          {/* Labels */}
          <text x="12" y="24" fill="#64748b" fontSize="8" fontFamily="monospace">2.0</text>
          <text x="12" y="60" fill="#64748b" fontSize="8" fontFamily="monospace">1.4</text>
          <text x="12" y="95" fill="#64748b" fontSize="8" fontFamily="monospace">0.8</text>
          <text x="12" y="138" fill="#64748b" fontSize="8" fontFamily="monospace">0.0</text>

          <text x="40" y="152" fill="#64748b" fontSize="8" fontFamily="monospace">Ep 1</text>
          <text x="200" y="152" fill="#64748b" fontSize="8" fontFamily="monospace">Ep 25</text>
          <text x="365" y="152" fill="#64748b" fontSize="8" fontFamily="monospace">Ep 50</text>

          {/* Paths */}
          <path d={trainPath} fill="none" stroke="#38bdf8" strokeWidth="2.5" className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]" />
          <path d={valPath} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />

          {/* Interactive hover points */}
          {ep.map((_, i) => (
            <rect
              key={i}
              x={getX(i) - 3}
              y={15}
              width={7}
              height={120}
              fill="transparent"
              className="cursor-pointer hover:fill-cyan-500/10"
              onMouseEnter={() => setHoverIdx(i)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

// 2. Interactive 50-Epoch Accuracy Curve Chart (Native SVG + Glows)
export function AccuracyCurveChart({ epochs, trainAcc, valAcc }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const ep = epochs || Array.from({ length: 50 }, (_, i) => i + 1);
  const tAcc = trainAcc || Array.from({ length: 50 }, (_, i) => Math.min(97.2, 30.0 + 67.2 * (1 - Math.exp(-0.09 * (i + 1)))));
  const vAcc = valAcc || Array.from({ length: 50 }, (_, i) => Math.min(91.2, 28.0 + 63.2 * (1 - Math.exp(-0.08 * (i + 1)))));

  const width = 380;
  const height = 150;
  const paddingLeft = 40;
  const paddingTop = 15;
  const paddingBottom = 25;
  const graphW = width - paddingLeft;
  const graphH = height - paddingTop - paddingBottom;

  const minVal = 20.0;
  const maxVal = 100.0;
  const getY = (val) => paddingTop + graphH - ((val - minVal) / (maxVal - minVal)) * graphH;
  const getX = (idx) => paddingLeft + (idx / (ep.length - 1)) * (graphW - 10);

  const trainPath = tAcc.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`).join(' ');
  const valPath = vAcc.map((val, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(val).toFixed(1)}`).join(' ');

  return (
    <div className="relative w-full h-full min-h-[220px] flex flex-col justify-between select-none">
      <div className="flex items-center justify-between text-xs font-mono mb-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span> Training Accuracy (97.2%)
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-0.5 border-b border-dashed border-amber-400 inline-block"></span> Validation Accuracy (91.2%)
          </span>
        </div>
        {hoverIdx !== null && (
          <span className="text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            Epoch {hoverIdx + 1}: Train={tAcc[hoverIdx]?.toFixed(1)}% | Val={vAcc[hoverIdx]?.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="relative flex-1 bg-slate-950/80 rounded-xl border border-slate-800 p-2 overflow-hidden">
        <svg viewBox="0 0 400 160" className="w-full h-full">
          {/* Grid lines */}
          <line x1="40" y1="20" x2="390" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="55" x2="390" y2="55" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="90" x2="390" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="40" y1="125" x2="390" y2="125" stroke="#1e293b" strokeDasharray="3 3" />

          {/* Axes */}
          <line x1="40" y1="15" x2="40" y2="135" stroke="#475569" strokeWidth="1" />
          <line x1="40" y1="135" x2="390" y2="135" stroke="#475569" strokeWidth="1" />

          {/* Labels */}
          <text x="12" y="24" fill="#64748b" fontSize="8" fontFamily="monospace">100%</text>
          <text x="12" y="60" fill="#64748b" fontSize="8" fontFamily="monospace">75%</text>
          <text x="12" y="95" fill="#64748b" fontSize="8" fontFamily="monospace">50%</text>
          <text x="12" y="138" fill="#64748b" fontSize="8" fontFamily="monospace">20%</text>

          <text x="40" y="152" fill="#64748b" fontSize="8" fontFamily="monospace">Ep 1</text>
          <text x="200" y="152" fill="#64748b" fontSize="8" fontFamily="monospace">Ep 25</text>
          <text x="365" y="152" fill="#64748b" fontSize="8" fontFamily="monospace">Ep 50</text>

          {/* Paths */}
          <path d={trainPath} fill="none" stroke="#10b981" strokeWidth="2.5" className="filter drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          <path d={valPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />

          {/* Interactive hover points */}
          {ep.map((_, i) => (
            <rect
              key={i}
              x={getX(i) - 3}
              y={15}
              width={7}
              height={120}
              fill="transparent"
              className="cursor-pointer hover:fill-emerald-500/10"
              onMouseEnter={() => setHoverIdx(i)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

// 3. Class Distribution Bar Chart (Figure 4.1)
export function ClassDistributionBarChart() {
  const classes = [
    { name: 'Normal', count: 105023, pct: 63.3, color: 'bg-emerald-500', barH: '100%' },
    { name: 'DoS', count: 45231, pct: 27.3, color: 'bg-amber-500', barH: '43%' },
    { name: 'Probe', count: 12248, pct: 7.4, color: 'bg-cyan-500', barH: '12%' },
    { name: 'R2L', count: 2360, pct: 1.4, color: 'bg-rose-500', barH: '4%' },
    { name: 'U2R', count: 1067, pct: 0.6, color: 'bg-purple-500', barH: '2%' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between font-mono text-xs select-none">
      <div className="flex items-end justify-between gap-4 h-48 px-4 pb-2 border-b border-slate-800 bg-slate-950/60 rounded-xl pt-6">
        {classes.map((c) => (
          <div key={c.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <span className="text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {c.count.toLocaleString()}
            </span>
            <div className="w-full max-w-[48px] bg-slate-900 rounded-t-lg overflow-hidden h-full flex items-end">
              <div 
                className={`w-full ${c.color} rounded-t-lg transition-all duration-700 group-hover:brightness-125`}
                style={{ height: c.barH }}
              ></div>
            </div>
            <span className="text-white font-bold text-[11px]">{c.name}</span>
            <span className="text-slate-500 text-[10px]">{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Class Distribution Doughnut Chart (Figure 4.1)
export function ClassDistributionDoughnut() {
  const slices = [
    { label: 'Normal', pct: 63.3, color: 'bg-emerald-400', stroke: '#34d399', count: '105,023' },
    { label: 'DoS', pct: 27.3, color: 'bg-amber-400', stroke: '#fbbf24', count: '45,231' },
    { label: 'Probe', pct: 7.4, color: 'bg-cyan-400', stroke: '#22d3ee', count: '12,248' },
    { label: 'R2L', pct: 1.4, color: 'bg-rose-400', stroke: '#fb7185', count: '2,360' },
    { label: 'U2R', pct: 0.6, color: 'bg-purple-400', stroke: '#c084fc', count: '1,067' }
  ];

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-around gap-4 font-mono text-xs">
      {/* SVG Ring */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="4.5" strokeDasharray="63.3 100" strokeDashoffset="0" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="27.3 100" strokeDashoffset="-63.3" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#06b6d4" strokeWidth="4.5" strokeDasharray="7.4 100" strokeDashoffset="-90.6" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f43f5e" strokeWidth="4.5" strokeDasharray="1.4 100" strokeDashoffset="-98.0" />
          <circle cx="18" cy="18" r="14" fill="transparent" stroke="#a855f7" strokeWidth="4.5" strokeDasharray="0.6 100" strokeDashoffset="-99.4" />
        </svg>
        <div className="absolute text-center">
          <span className="text-[10px] text-slate-400 block">Total</span>
          <span className="text-xs font-bold text-white font-mono">165.9k</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-1.5">
        {slices.map(s => (
          <div key={s.label} className="flex items-center gap-3 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
            <span className="text-slate-300 w-16">{s.label}:</span>
            <span className="text-white font-bold">{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Model Comparison Grouped Bar Chart
export function ModelComparisonBarChart({ comparisonData }) {
  const rows = comparisonData || [
    { algorithm: 'Random Forest', accuracy: 98.6, precision: 98.4, recall: 98.6, f1_score: 98.5 },
    { algorithm: 'Decision Tree', accuracy: 94.2, precision: 93.8, recall: 94.2, f1_score: 94.0 },
    { algorithm: 'Support Vector Machine', accuracy: 91.5, precision: 90.8, recall: 91.5, f1_score: 91.1 }
  ];

  return (
    <div className="w-full space-y-3 font-mono text-xs">
      {rows.map((r) => (
        <div key={r.algorithm} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-2">
              {r.algorithm === 'Random Forest' && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
              <span className={r.algorithm === 'Random Forest' ? 'text-cyan-300' : 'text-slate-300'}>
                {r.algorithm}
              </span>
            </span>
            <span className="text-emerald-400 font-bold">F1: {r.f1_score}% | Acc: {r.accuracy}%</span>
          </div>

          {/* 4 Metric Sub-Bars */}
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Acc</span> <span>{r.accuracy}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${r.accuracy}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Prec</span> <span>{r.precision}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: `${r.precision}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>Rec</span> <span>{r.recall}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.recall}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>F1</span> <span>{r.f1_score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${r.f1_score}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 6. Gini Feature Importance Horizontal Bar Chart
export function FeatureImportanceBarChart() {
  const feats = [
    { label: 'src_bytes (Payload Size)', pct: 28.4, color: 'bg-cyan-500' },
    { label: 'serror_rate (SYN Error %)', pct: 22.1, color: 'bg-sky-500' },
    { label: 'count (Connection Burst)', pct: 18.7, color: 'bg-blue-500' },
    { label: 'duration (Connection Sec)', pct: 12.5, color: 'bg-indigo-500' },
    { label: 'num_failed_logins (Auth Check)', pct: 9.8, color: 'bg-purple-500' },
    { label: 'dst_bytes (Server Reply)', pct: 5.3, color: 'bg-rose-500' },
    { label: 'same_srv_rate (Port Uniformity)', pct: 3.2, color: 'bg-emerald-500' }
  ];

  return (
    <div className="w-full space-y-2.5 font-mono text-xs">
      {feats.map((f) => (
        <div key={f.label} className="space-y-1">
          <div className="flex justify-between text-slate-300 text-[11px]">
            <span>{f.label}</span>
            <span className="text-cyan-400 font-bold">{f.pct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className={`h-full ${f.color} rounded-full transition-all duration-500`}
              style={{ width: `${f.pct * 3}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
