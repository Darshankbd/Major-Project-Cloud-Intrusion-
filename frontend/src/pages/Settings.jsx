import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Lock, 
  Server, 
  Save, 
  Check, 
  Sliders,
  User,
  Radio
} from 'lucide-react';
import { api } from '../services/api';

export function Settings({ user, onOpenAuth }) {
  const [settings, setSettings] = useState({
    auto_block_critical: 'true',
    alert_threshold: '0.75',
    telemetry_speed_ms: '1200',
    aws_sg_sync: 'false',
    iptables_auto_apply: 'false'
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.getSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await api.saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white">System Settings & SOC Policies</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Configure real-time automated mitigation thresholds, firewall integration, and operator credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Automated Threat Mitigation Configuration</span>
            </h2>
            {saved && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Settings Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5 font-mono text-xs">
            {/* Auto Block Critical Toggles */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-semibold block">Auto-Block Critical / High Threats</span>
                <span className="text-[11px] text-slate-400">
                  Automatically synthesize DROP rules upon DoS/U2R classification
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.auto_block_critical === 'true'}
                onChange={(e) => setSettings({ ...settings, auto_block_critical: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </div>

            {/* Alert Confidence Threshold */}
            <div className="space-y-2">
              <label className="block text-slate-300 font-semibold">
                Anomaly Probability Threshold: <span className="text-cyan-400">{Math.round(parseFloat(settings.alert_threshold) * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={settings.alert_threshold}
                onChange={(e) => setSettings({ ...settings, alert_threshold: e.target.value })}
                className="w-full accent-cyan-500 bg-slate-800"
              />
              <span className="text-[11px] text-slate-500 block">
                Packets with ML probability above this threshold trigger immediate high-priority alerts.
              </span>
            </div>

            {/* Telemetry Ingestion Interval */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">
                Live Telemetry Ingestion Rate (ms)
              </label>
              <input
                type="number"
                step="100"
                min="500"
                max="5000"
                value={settings.telemetry_speed_ms}
                onChange={(e) => setSettings({ ...settings, telemetry_speed_ms: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* AWS Cloud Sync */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-semibold block">AWS Security Group API Sync</span>
                <span className="text-[11px] text-slate-400">
                  Transmit NACL 50 and EC2 Security Group ingress revocation rules to AWS IAM
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.aws_sg_sync === 'true'}
                onChange={(e) => setSettings({ ...settings, aws_sg_sync: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Apply & Save Settings'}</span>
            </button>
          </form>
        </div>

        {/* User Account & Role Summary (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Active Operator Profile</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Operator:</span>
                <span className="text-white font-bold">{user ? user.username : 'admin (Default)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="text-cyan-400 font-bold">{user ? user.role : 'System Administrator'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Node IP:</span>
                <span className="text-emerald-400 font-bold">127.0.0.1 (Local SOC)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Role-Based Access Control (RBAC) grants Administrator authority over system tuning and algorithm parameters, while Security Analysts manage alerts and investigate incident reports.
            </p>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-semibold rounded-xl transition-colors"
          >
            Switch Operator / Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
