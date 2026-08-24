import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Radio, 
  Lock, 
  Server, 
  Terminal, 
  ExternalLink,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import { ThreatBadge, AttackBadge } from '../components/ThreatBadge';

export function Dashboard({ isStreaming, setIsStreaming, setCurrentPage }) {
  const [stats, setStats] = useState({
    total_inspected: 1240,
    threats_detected: 94,
    normal_traffic: 1146,
    active_alerts: 5,
    mitigated_threats: 14,
    threat_distribution: { 'Normal': 1146, 'DoS': 52, 'Probe': 28, 'R2L': 10, 'U2R': 4 },
    recent_alerts: [],
    system_health: "Optimal (Firewall & ML Active)"
  });

  const [livePackets, setLivePackets] = useState([]);
  const [selectedAlertForMitigation, setSelectedAlertForMitigation] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const pullPacket = async () => {
    try {
      const packet = await api.getLiveTelemetryPacket();
      setLivePackets(prev => [packet, ...prev.slice(0, 19)]);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    pullPacket();
  }, []);

  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => {
        pullPacket();
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleMitigate = async (alertId) => {
    try {
      await api.mitigateAlert(alertId);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const threatRate = stats.total_inspected > 0 
    ? ((stats.threats_detected / stats.total_inspected) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-6 py-4">
      {/* Top Header & Telemetry Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <h1 className="text-lg font-bold text-white">Live Security Operations Center (SOC)</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Active ML Model: <span className="text-cyan-400 font-semibold">Random Forest (100 Trees)</span> • Pipeline Mode: <span className="text-emerald-400">Continuous Ingress</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={pullPacket}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ingest Packet</span>
          </button>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              isStreaming
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/30'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-spin' : ''}`} />
            <span>{isStreaming ? 'Pause Stream' : 'Start Live Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Inspected</span>
          <div className="text-2xl font-black font-mono text-white">{stats.total_inspected}</div>
          <span className="text-[10px] text-cyan-400 font-mono">Network Flow Vectors</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-rose-500/20 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Intrusions Flagged</span>
          <div className="text-2xl font-black font-mono text-rose-400">{stats.threats_detected}</div>
          <span className="text-[10px] text-rose-300 font-mono">{threatRate}% Threat Ratio</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-emerald-500/20 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Normal Traffic</span>
          <div className="text-2xl font-black font-mono text-emerald-400">{stats.normal_traffic}</div>
          <span className="text-[10px] text-emerald-300 font-mono">Legitimate Ingress</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-amber-500/20 space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Active Alerts</span>
          <div className="text-2xl font-black font-mono text-amber-400">{stats.active_alerts}</div>
          <span className="text-[10px] text-amber-300 font-mono">Pending SOC Action</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d1424] border border-cyan-500/20 space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Mitigated Rules</span>
          <div className="text-2xl font-black font-mono text-cyan-400">{stats.mitigated_threats}</div>
          <span className="text-[10px] text-cyan-300 font-mono">iptables / AWS Enforced</span>
        </div>
      </div>

      {/* Main Grid: Live Telemetry Stream + Threat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Packet Stream Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-3 p-5 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Live Network Flow Telemetry (Packet Inspector)</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {livePackets.length} recent frames
            </span>
          </div>

          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-900 text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Source IP</th>
                  <th className="py-2 px-3">Protocol / Service</th>
                  <th className="py-2 px-3">Classification</th>
                  <th className="py-2 px-3">Confidence</th>
                  <th className="py-2 px-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {livePackets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No live packets received yet. Click "Start Live Telemetry" or "Ingest Packet".
                    </td>
                  </tr>
                ) : (
                  livePackets.map((pkt, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-slate-800/50 transition-colors ${
                        pkt.is_threat ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-slate-400">{pkt.timestamp?.split(' ')[1] || '14:20:00'}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{pkt.source_ip}</td>
                      <td className="py-2.5 px-3 text-slate-300">
                        <span className="text-cyan-400">{pkt.protocol?.toUpperCase()}</span> / {pkt.service}
                      </td>
                      <td className="py-2.5 px-3">
                        <AttackBadge attackType={pkt.prediction} />
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{pkt.confidence}%</td>
                      <td className="py-2.5 px-3">
                        <ThreatBadge severity={pkt.severity} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat Distribution & System Health (1 Col) */}
        <div className="space-y-6">
          {/* Attack Distribution */}
          <div className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Attack Class Distribution</span>
            </h2>

            <div className="space-y-3">
              {[
                { label: 'Normal Traffic', count: stats.threat_distribution['Normal'] || 0, color: 'bg-emerald-500' },
                { label: 'DoS (Denial of Service)', count: stats.threat_distribution['DoS'] || 0, color: 'bg-rose-500' },
                { label: 'Probe (Port Scanning)', count: stats.threat_distribution['Probe'] || 0, color: 'bg-amber-500' },
                { label: 'R2L (Remote to Local)', count: stats.threat_distribution['R2L'] || 0, color: 'bg-cyan-500' },
                { label: 'U2R (User to Root)', count: stats.threat_distribution['U2R'] || 0, color: 'bg-purple-500' },
              ].map((item, i) => {
                const pct = stats.total_inspected > 0 ? ((item.count / stats.total_inspected) * 100).toFixed(1) : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="text-slate-400 font-bold">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(3, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-3 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>SOC Quick Navigation</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setCurrentPage('sandbox')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-left transition-colors"
              >
                ➔ Red Team Sandbox
              </button>
              <button
                onClick={() => setCurrentPage('train')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-left transition-colors"
              >
                ➔ Retrain ML Suite
              </button>
              <button
                onClick={() => setCurrentPage('evaluation')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-left transition-colors"
              >
                ➔ 50-Epoch Curves
              </button>
              <button
                onClick={() => setCurrentPage('reports')}
                className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 text-left transition-colors"
              >
                ➔ Executive PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts & Mitigation Stream */}
      <div className="p-5 rounded-2xl bg-[#0d1424] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white">Active Intrusion Alerts & Auto-Mitigation</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Real-time Perimeter Enforcement
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.recent_alerts && stats.recent_alerts.length > 0 ? (
            stats.recent_alerts.map((alt) => (
              <div 
                key={alt.id} 
                className={`p-4 rounded-xl border ${
                  alt.status === 'Mitigated'
                    ? 'bg-slate-900/50 border-slate-800 opacity-75'
                    : 'bg-rose-950/20 border-rose-500/40 shadow-md shadow-rose-950/30'
                } space-y-3 flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <ThreatBadge severity={alt.severity} />
                    <span className="text-[10px] font-mono text-slate-400">{alt.timestamp?.split(' ')[1] || 'Just now'}</span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                      <span>{alt.attack_type} Attack</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Target: {alt.destination_ip}
                    </p>
                    <p className="text-xs text-rose-300 font-mono">
                      Origin: {alt.source_ip}
                    </p>
                  </div>

                  <div className="p-2 bg-slate-950 rounded font-mono text-[10px] text-cyan-300 break-all border border-slate-800">
                    <code>{alt.firewall_rule || `iptables -I INPUT -s ${alt.source_ip} -j DROP`}</code>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`text-xs font-mono font-semibold ${
                    alt.status === 'Mitigated' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    Status: {alt.status}
                  </span>

                  {alt.status !== 'Mitigated' && (
                    <button
                      onClick={() => handleMitigate(alt.id)}
                      className="px-3 py-1 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white text-xs font-mono font-bold rounded-lg transition-all shadow-sm"
                    >
                      Enforce Block
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-slate-500 font-mono text-xs">
              No active security alerts pending mitigation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
