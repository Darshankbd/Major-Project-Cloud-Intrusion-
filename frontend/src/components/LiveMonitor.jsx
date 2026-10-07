import React, { useState } from 'react';
import { Radio, Zap, Info, Filter } from 'lucide-react';
import { injectAttack } from '../services/api';

export default function LiveMonitor({ liveLogs }) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [injecting, setInjecting] = useState(false);

  const handleInject = async (type) => {
    setInjecting(true);
    try {
      await injectAttack(type, 5);
    } catch (e) {
      console.error(e);
    } finally {
      setInjecting(false);
    }
  };

  const filteredLogs = liveLogs.filter((log) => {
    if (filterSeverity === 'ALL') return true;
    return log.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="glass-panel p-5 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            Live Cloud Flow Log Ingestion Stream
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inspection of VPC flow logs, packet lengths, payload entropy, and ML threat predictions.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Inject Attack:</span>
          <button
            onClick={() => handleInject('DoS_DDoS')}
            disabled={injecting}
            className="btn btn-danger text-xs py-1.5 px-3"
          >
            <Zap className="w-3.5 h-3.5" /> DoS Flood
          </button>
          <button
            onClick={() => handleInject('Port_Scan')}
            disabled={injecting}
            className="btn btn-secondary text-xs py-1.5 px-3 hover:border-amber-500/50 text-amber-300"
          >
            Port Scan
          </button>
          <button
            onClick={() => handleInject('Brute_Force')}
            disabled={injecting}
            className="btn btn-secondary text-xs py-1.5 px-3 hover:border-orange-500/50 text-orange-300"
          >
            SSH BruteForce
          </button>
          <button
            onClick={() => handleInject('Malware_C2')}
            disabled={injecting}
            className="btn btn-secondary text-xs py-1.5 px-3 hover:border-purple-500/50 text-purple-300"
          >
            Malware C2
          </button>
          <button
            onClick={() => handleInject('IAM_Privilege_Escalation')}
            disabled={injecting}
            className="btn btn-secondary text-xs py-1.5 px-3 hover:border-rose-500/50 text-rose-300"
          >
            IAM Escalation
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 lg:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filter Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded transition ${
                  filterSeverity === sev ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{filteredLogs.length}</strong> live records
          </span>
        </div>

        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 sticky top-0 text-slate-400 uppercase text-[10px] z-10 border-b border-slate-800">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Flow ID</th>
                <th className="p-3.5">Source & Dest IP</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Entropy</th>
                <th className="p-3.5">Prediction</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Zero-Day Anomaly</th>
                <th className="p-3.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition">
                  <td className="p-3.5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3.5 font-semibold text-slate-200">{log.flow_id}</td>
                  <td className="p-3.5">
                    <div className="text-slate-200 font-bold">{log.src_ip} ({log.geo_country})</div>
                    <div className="text-slate-500 text-[10px]">→ {log.dst_ip}:{log.dst_port}</div>
                  </td>
                  <td className="p-3.5 text-blue-300 font-semibold">{log.service} ({log.protocol_type})</td>
                  <td className="p-3.5 text-slate-300">{log.payload_entropy}</td>
                  <td className="p-3.5">
                    <span className={`font-semibold ${log.prediction === 'BENIGN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {log.prediction}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`badge ${
                      log.severity === 'CRITICAL' ? 'badge-critical' :
                      log.severity === 'HIGH' ? 'badge-high' :
                      log.severity === 'MEDIUM' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-200">
                    {((log.risk_score || 0) * 100).toFixed(0)}%
                  </td>
                  <td className="p-3.5">
                    {log.is_zero_day_anomaly ? (
                      <span className="badge badge-anomaly">ANOMALY DETECTED</span>
                    ) : (
                      <span className="text-slate-600 text-[10px]">Normal</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-400"
                    >
                      <Info className="w-4 h-4" />
                    </button>
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
