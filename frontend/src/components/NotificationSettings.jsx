import React, { useState, useEffect } from 'react';
import { Bell, Mail, Webhook, Save, CheckCircle2, FileText, Send } from 'lucide-react';
import { fetchOrgSettings, saveOrgSettings, fetchNotificationLogs } from '../services/api';

export default function NotificationSettings() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [logs, setLogs] = useState([]);
  const [savedMsg, setSavedMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const settings = await fetchOrgSettings();
      setWebhookUrl(settings.webhook_url || '');
      setNotificationEmail(settings.notification_email || '');

      const logData = await fetchNotificationLogs();
      setLogs(logData.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveOrgSettings({
        webhook_url: webhookUrl,
        notification_email: notificationEmail
      });
      setSavedMsg("Organization Security Alert channels saved.");
      setTimeout(() => setSavedMsg(null), 3000);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header Banner */}
      <div className="glass-panel p-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-400" />
            Enterprise Intrusion Notification Channels & Webhook Rules
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure real-time automated alerts via Email SMTP and Slack/Discord Webhooks when critical intrusions are detected.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="glass-panel p-6 lg:p-7 space-y-4 lg:col-span-1">
          <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Webhook className="w-5 h-5 text-blue-400" />
            Alert Dispatch Configuration
          </h4>

          {savedMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {savedMsg}
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Slack / Discord Webhook URL</label>
              <input
                type="text" required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Security Officer Alert Email</label>
              <input
                type="email" required
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                placeholder="security@cloudguard.io"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-2.5 text-xs font-bold"
            >
              <Save className="w-4 h-4" /> Save Notification Rules
            </button>
          </div>
        </form>

        {/* Dispatch Audit Logs */}
        <div className="glass-panel p-6 lg:p-7 space-y-4 lg:col-span-2">
          <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-purple-400" />
            Notification Dispatch Audit History
          </h4>

          <div className="overflow-x-auto max-h-[420px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 sticky top-0 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Sent Timestamp</th>
                  <th className="p-3">Alert ID</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">{log.sent_at}</td>
                    <td className="p-3 font-bold text-slate-200">{log.alert_id}</td>
                    <td className="p-3 text-blue-300 font-bold">{log.channel}</td>
                    <td className="p-3 text-slate-300 truncate max-w-[200px]">{log.recipient}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
