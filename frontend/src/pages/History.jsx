import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { ThreatBadge, AttackBadge } from '../components/ThreatBadge';

export function History() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [attackType, setAttackType] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory(page, 12, search, severity, attackType);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, severity, attackType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="space-y-6 py-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Detection Audit Trail & History</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Complete historical record of inspected flow vectors and threat classifications in SQLite
          </p>
        </div>

        <a
          href={api.getCsvReportUrl()}
          download
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold transition-all shadow-md w-fit"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Log (CSV)</span>
        </a>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-[#0d1424] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search IP, Service, Target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Severity:</span>
            <select
              value={severity}
              onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Class:</span>
            <select
              value={attackType}
              onChange={(e) => { setAttackType(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All</option>
              <option value="Normal">Normal</option>
              <option value="DoS">DoS</option>
              <option value="Probe">Probe</option>
              <option value="R2L">R2L</option>
              <option value="U2R">U2R</option>
            </select>
          </div>

          <button
            onClick={fetchHistory}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Protocol / Service</th>
                <th className="py-2.5 px-3">Prediction</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-slate-500">#{log.id}</td>
                    <td className="py-3 px-3 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{log.source_ip}</td>
                    <td className="py-3 px-3 text-slate-300">{log.destination_ip}</td>
                    <td className="py-3 px-3 text-slate-300">
                      <span className="text-cyan-400">{log.protocol?.toUpperCase()}</span> / {log.service}
                    </td>
                    <td className="py-3 px-3">
                      <AttackBadge attackType={log.prediction} />
                    </td>
                    <td className="py-3 px-3 text-slate-300">{log.confidence}%</td>
                    <td className="py-3 px-3">
                      <ThreatBadge severity={log.severity} />
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[10px]">{log.dataset_source}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
          <span className="text-slate-400">
            Showing Page <b>{page}</b> of <b>{totalPages}</b> ({total} records total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
