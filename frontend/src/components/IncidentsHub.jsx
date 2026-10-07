import React, { useState } from 'react';
import { AlertTriangle, Lock, RefreshCw, CheckCircle } from 'lucide-react';
import { mitigateAlert } from '../services/api';

export default function IncidentsHub({ alerts, onRefreshAlerts }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [mitigatingId, setMitigatingId] = useState(null);

  const handleMitigate = async (alertId, actionName) => {
    setMitigatingId(alertId);
    try {
      await mitigateAlert(alertId, actionName);
      if (onRefreshAlerts) onRefreshAlerts();
    } catch (e) {
      console.error(e);
    } finally {
      setMitigatingId(null);
    }
  };

  const alertList = alerts?.alerts || [];
  const filteredAlerts = alertList.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="glass-panel p-5 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Security Incident Triage & Automated Mitigation Hub
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Review active cloud threat alerts, initiate automated IP blocks, isolate target VMs, and audit resolution history.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Filter Status:</span>
          {['ALL', 'ACTIVE', 'MITIGATED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded transition ${
                filterStatus === st ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={onRefreshAlerts}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 ml-2"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 lg:p-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Alert ID</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Threat Category</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Source IP</th>
                <th className="p-3.5">Cloud Region</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Mitigation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.map((alert) => (
                <tr key={alert.alert_id} className="hover:bg-slate-800/40">
                  <td className="p-3.5 font-bold text-slate-200">{alert.alert_id}</td>
                  <td className="p-3.5 text-slate-400">{alert.timestamp}</td>
                  <td className="p-3.5 text-rose-300 font-semibold">{alert.threat_type}</td>
                  <td className="p-3.5">
                    <span className={`badge ${
                      alert.severity === 'CRITICAL' ? 'badge-critical' :
                      alert.severity === 'HIGH' ? 'badge-high' : 'badge-medium'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-bold">{alert.src_ip}</td>
                  <td className="p-3.5 text-slate-400">{alert.cloud_region}</td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      alert.status === 'MITIGATED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    {alert.status === 'MITIGATED' ? (
                      <span className="text-emerald-400 flex items-center justify-end gap-1 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Mitigated
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleMitigate(alert.alert_id, 'Block Source IP')}
                          disabled={mitigatingId === alert.alert_id}
                          className="btn btn-danger text-[11px] py-1 px-2.5 font-bold"
                        >
                          <Lock className="w-3 h-3" /> Block IP
                        </button>
                        <button
                          onClick={() => handleMitigate(alert.alert_id, 'Isolate Host VM')}
                          disabled={mitigatingId === alert.alert_id}
                          className="btn btn-secondary text-[11px] py-1 px-2.5"
                        >
                          Isolate Host
                        </button>
                      </div>
                    )}
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
