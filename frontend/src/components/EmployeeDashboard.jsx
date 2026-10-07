import React, { useState } from 'react';
import { ShieldCheck, Server, AlertTriangle, Send, User, Lock, Activity, CheckCircle } from 'lucide-react';
import { submitIncidentReport } from '../services/api';

export default function EmployeeDashboard({ currentUser, liveLogs }) {
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incSeverity, setIncSeverity] = useState('HIGH');
  const [submittedMsg, setSubmittedMsg] = useState(null);

  const assignedResources = currentUser?.assigned_resources || [
    { resource_name: 'Web-Server-01', ip_address: '10.0.1.15', subnet: 'Public Web Subnet (10.0.1.0/24)' }
  ];

  const assignedIPs = assignedResources.map(r => r.ip_address);

  // Filter live stream targeting employee's assigned instances
  const myAttacks = liveLogs.filter(l => assignedIPs.includes(l.dst_ip) || l.dst_ip === '10.0.1.15');

  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    if (!incTitle || !incDesc) return;

    try {
      await submitIncidentReport({
        user_id: currentUser?.id || "USR-EMP-001",
        user_name: currentUser?.full_name || "Alice Smith",
        user_email: currentUser?.email || "alice@cloudguard.io",
        title: incTitle,
        description: incDesc,
        severity: incSeverity
      });

      setSubmittedMsg("Incident report submitted successfully to Org Security Operations.");
      setIncTitle('');
      setIncDesc('');
      setTimeout(() => setSubmittedMsg(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header Banner */}
      <div className="glass-panel p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-100">{currentUser?.full_name || "Alice Smith"}</h3>
              <span className="badge badge-low text-[10px]">EMPLOYEE PORTAL</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Department: <strong className="text-slate-200">{currentUser?.department || "DevOps Engineering"}</strong> | Corporate Email: <strong className="text-slate-200">{currentUser?.email || "alice@cloudguard.io"}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Personal Resource Security</span>
            <span className="text-xl font-bold text-emerald-400">98.5% HEALTHY</span>
          </div>
        </div>
      </div>

      {/* Grid: Assigned Resources & Incident Reporter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Assigned Cloud Resources */}
        <div className="glass-panel p-6 lg:p-7 space-y-4 lg:col-span-2">
          <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="w-5 h-5 text-blue-400" />
            My Assigned Cloud Infrastructure Resources
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedResources.map((res, i) => (
              <div key={i} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm">{res.resource_name}</span>
                  <span className="badge badge-low text-[10px]">OPERATIONAL</span>
                </div>
                
                <div className="space-y-1 text-xs text-slate-400">
                  <p><span className="text-slate-500">IP Address:</span> <strong className="text-slate-200">{res.ip_address}</strong></p>
                  <p><span className="text-slate-500">Subnet:</span> <strong className="text-slate-300">{res.subnet}</strong></p>
                  <p><span className="text-slate-500">ML Protection Status:</span> <strong className="text-emerald-400">Shield Active</strong></p>
                </div>
              </div>
            ))}
          </div>

          {/* Attacks targeting employee's assigned VM */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              Live Attack Stream Targeting My Assigned VM ({assignedIPs[0] || '10.0.1.15'})
            </h5>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Attacker Source IP</th>
                    <th className="p-3">Threat Category</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {myAttacks.slice(0, 5).map((log, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">{log.timestamp}</td>
                      <td className="p-3 text-slate-200 font-bold">{log.src_ip} ({log.geo_country})</td>
                      <td className="p-3 text-rose-300 font-semibold">{log.prediction}</td>
                      <td className="p-3">
                        <span className={`badge ${
                          log.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-400 text-[10px] font-bold">INSPECTED</span>
                      </td>
                    </tr>
                  ))}
                  {myAttacks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-slate-500 text-xs">No active attacks targeting your assigned resources.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Report Anomaly Form */}
        <div className="glass-panel p-6 lg:p-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Report Security Anomaly / Phishing
            </h4>
            <p className="text-xs text-slate-400">
              Spotted suspicious behavior or unexpected network activity? Submit an anomaly report directly to Org Security Operations.
            </p>

            {submittedMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {submittedMsg}
              </div>
            )}

            <form onSubmit={handleSubmitIncident} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Anomaly Title</label>
                <input
                  type="text" required
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  placeholder="e.g. Unusual Outbound API Traffic on Port 8443"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Severity Level</label>
                <select
                  value={incSeverity}
                  onChange={(e) => setIncSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Detailed Description</label>
                <textarea
                  rows="4" required
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  placeholder="Describe observed suspicious packets or unexpected login attempts..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full py-2.5 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" /> Submit Security Report
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
