import React, { useState } from 'react';
import { ShieldAlert, Activity, CheckCircle2, Cpu, ArrowUpRight, Flame, Sliders } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import CyberThreatMap from './CyberThreatMap';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#3B82F6', '#EC4899'];

export default function CommandCenter({ stats, liveLogs, alerts, mlMetrics, onSpeedChange }) {
  const [speedInterval, setSpeedInterval] = useState(1.0);

  const handleSpeedSlider = (e) => {
    const val = parseFloat(e.target.value);
    setSpeedInterval(val);
    if (onSpeedChange) onSpeedChange(val);
  };

  const chartData = liveLogs.slice(0, 15).reverse().map((log, idx) => ({
    time: log.timestamp ? log.timestamp.split(' ')[1] : `T-${idx}`,
    riskScore: log.risk_score ? (log.risk_score * 100) : 10,
    anomalyScore: log.anomaly_score ? (log.anomaly_score * 100) : 5,
  }));

  const threatCounts = {};
  liveLogs.forEach((l) => {
    const type = l.prediction || 'BENIGN';
    threatCounts[type] = (threatCounts[type] || 0) + 1;
  });

  const pieData = Object.keys(threatCounts).map((key) => ({
    name: key.replace('_', ' '),
    value: threatCounts[key]
  }));

  const bestAccuracy = mlMetrics?.metrics?.xgboost?.accuracy
    ? (mlMetrics.metrics.xgboost.accuracy * 100).toFixed(1) + '%'
    : '98.4%';

  return (
    <div className="space-y-8 font-mono">
      <div className="glass-panel p-5 lg:px-7 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Sliders className="w-4.5 h-4.5 text-blue-400" />
          <span className="text-slate-200 font-bold text-sm">Simulator Telemetry Rate:</span>
          <span className="badge badge-low text-xs font-bold py-1 px-3">{speedInterval}s / flow</span>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-80">
          <span className="text-slate-400 font-medium">Fast (0.1s)</span>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.1"
            value={speedInterval}
            onChange={handleSpeedSlider}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
          <span className="text-slate-400 font-medium">Slow (3.0s)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 lg:p-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono tracking-wider">FLOWS ANALYZED</p>
            <h3 className="text-3xl font-bold text-slate-100 font-mono mt-2">
              {stats?.generated_count || liveLogs.length || 1240}
            </h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-2 font-mono font-medium">
              <ArrowUpRight className="w-4 h-4" /> Real-time stream active
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        <div className="glass-panel glass-panel-danger p-6 lg:p-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono tracking-wider">ACTIVE INCIDENTS</p>
            <h3 className="text-3xl font-bold text-rose-400 font-mono mt-2">
              {alerts?.summary?.active || 3}
            </h3>
            <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-2 font-mono font-medium">
              <Flame className="w-4 h-4" /> {alerts?.summary?.critical || 1} Critical severity
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
        </div>

        <div className="glass-panel p-6 lg:p-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono tracking-wider">AUTONOMOUS MITIGATION</p>
            <h3 className="text-3xl font-bold text-emerald-400 font-mono mt-2">
              {alerts?.summary?.mitigation_rate || 94.2}%
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-mono font-medium">
              Auto-Block Firewall Active
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        <div className="glass-panel glass-panel-glow p-6 lg:p-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 font-mono tracking-wider">ML ENGINE ACCURACY</p>
            <h3 className="text-3xl font-bold text-blue-400 font-mono mt-2">
              {bestAccuracy}
            </h3>
            <p className="text-xs text-slate-400 mt-2 font-mono font-medium">
              Hybrid RF + XGB + IsoForest
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Cpu className="w-7 h-7" />
          </div>
        </div>
      </div>

      <CyberThreatMap liveLogs={liveLogs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-6 lg:p-7 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Real-Time Threat Risk Velocity</h3>
              <p className="text-xs text-slate-400 mt-1">Dynamic Risk Score % & Anomaly Index per packet flow</p>
            </div>
            <span className="badge badge-low text-xs px-3 py-1">LIVE FEED</span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={12} dy={10} />
                <YAxis stroke="#64748B" fontSize={12} domain={[0, 100]} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', padding: '12px' }}
                />
                <Area type="monotone" dataKey="riskScore" name="Risk Score %" stroke="#EF4444" fillOpacity={1} fill="url(#riskGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="anomalyScore" name="Anomaly Index %" stroke="#8B5CF6" fillOpacity={1} fill="url(#anomalyGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 lg:p-7 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-100">Threat Distribution</h3>
            <p className="text-xs text-slate-400 mt-1">Category breakdown of detected cloud flows</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', padding: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500 font-mono">Waiting for flow logs...</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-4 border-t border-slate-800">
            {pieData.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-400 truncate">{item.name}: <strong className="text-slate-200">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 lg:p-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <ShieldAlert className="w-5.5 h-5.5 text-rose-400" />
            Recent Security Incidents
          </h3>
          <span className="text-xs text-slate-400 font-mono">Top 5 active threats</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Incident ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Threat Category</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Source IP</th>
                <th className="p-4">Cloud Region</th>
                <th className="p-4">Confidence</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {alerts?.alerts?.slice(0, 5).map((alert) => (
                <tr key={alert.alert_id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-slate-200">{alert.alert_id}</td>
                  <td className="p-4 text-slate-400">{alert.timestamp}</td>
                  <td className="p-4 text-rose-300 font-semibold text-sm">{alert.threat_type}</td>
                  <td className="p-4">
                    <span className={`badge ${
                      alert.severity === 'CRITICAL' ? 'badge-critical' :
                      alert.severity === 'HIGH' ? 'badge-high' : 'badge-medium'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-200 font-semibold">{alert.src_ip}</td>
                  <td className="p-4 text-slate-400">{alert.cloud_region}</td>
                  <td className="p-4 text-blue-400 font-bold">{(alert.confidence * 100).toFixed(1)}%</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      alert.status === 'MITIGATED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
