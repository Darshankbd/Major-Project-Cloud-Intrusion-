import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { fetchPredictFlow } from '../services/api';

const PRESETS = {
  normal: {
    name: 'Normal HTTPS Traffic',
    data: {
      duration: 2.5, protocol_type: 'TCP', service: 'HTTPS', flag: 'SF',
      src_bytes: 4200, dst_bytes: 18500, src_pkts: 32, dst_pkts: 45,
      pkt_len_mean: 450, pkt_len_std: 120, header_bytes: 1024,
      payload_entropy: 3.2, failed_logins: 0, iam_risk_score: 0.5,
      same_srv_rate: 0.95, diff_srv_rate: 0.05, serror_rate: 0.0, rerror_rate: 0.0,
      cloud_region: 'us-east-1'
    }
  },
  dos: {
    name: 'SYN Flood DDoS Attack Signature',
    data: {
      duration: 0.002, protocol_type: 'TCP', service: 'HTTP', flag: 'S0',
      src_bytes: 250000, dst_bytes: 0, src_pkts: 6000, dst_pkts: 0,
      pkt_len_mean: 44, pkt_len_std: 0, header_bytes: 240000,
      payload_entropy: 0.5, failed_logins: 0, iam_risk_score: 1.2,
      same_srv_rate: 1.0, diff_srv_rate: 0.0, serror_rate: 0.98, rerror_rate: 0.0,
      cloud_region: 'us-east-1'
    }
  },
  bruteforce: {
    name: 'SSH Password Brute-Force Signature',
    data: {
      duration: 45.0, protocol_type: 'TCP', service: 'SSH', flag: 'SF',
      src_bytes: 18000, dst_bytes: 14000, src_pkts: 180, dst_pkts: 180,
      pkt_len_mean: 180, pkt_len_std: 45, header_bytes: 5760,
      payload_entropy: 3.8, failed_logins: 42, iam_risk_score: 6.5,
      same_srv_rate: 0.95, diff_srv_rate: 0.05, serror_rate: 0.1, rerror_rate: 0.2,
      cloud_region: 'us-west-2'
    }
  },
  c2: {
    name: 'Malware Command & Control Channel',
    data: {
      duration: 320.0, protocol_type: 'TCP', service: 'C2_Custom', flag: 'SF',
      src_bytes: 450000, dst_bytes: 120000, src_pkts: 350, dst_pkts: 350,
      pkt_len_mean: 850, pkt_len_std: 310, header_bytes: 11200,
      payload_entropy: 7.85, failed_logins: 0, iam_risk_score: 7.5,
      same_srv_rate: 0.85, diff_srv_rate: 0.15, serror_rate: 0.0, rerror_rate: 0.0,
      cloud_region: 'eu-central-1'
    }
  },
  iam: {
    name: 'IAM Privilege Escalation Signature',
    data: {
      duration: 12.0, protocol_type: 'TCP', service: 'HTTPS', flag: 'SF',
      src_bytes: 8500, dst_bytes: 22000, src_pkts: 45, dst_pkts: 45,
      pkt_len_mean: 550, pkt_len_std: 180, header_bytes: 1440,
      payload_entropy: 4.2, failed_logins: 4, iam_risk_score: 9.8,
      same_srv_rate: 0.60, diff_srv_rate: 0.40, serror_rate: 0.0, rerror_rate: 0.0,
      cloud_region: 'ap-south-1'
    }
  }
};

export default function PacketInspector() {
  const [formData, setFormData] = useState(PRESETS.normal.data);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, val) => {
    setFormData({ ...formData, [field]: val });
  };

  const handleApplyPreset = (presetKey) => {
    setFormData(PRESETS[presetKey].data);
    setResult(null);
  };

  const handleRunInspection = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchPredictFlow(formData);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="glass-panel p-5 lg:p-7 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Interactive Cloud Packet & Flow Inspector
          </h3>
          <span className="text-xs text-slate-400">Select Preset Signature:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => handleApplyPreset(key)}
              className="btn btn-secondary text-xs py-1.5 px-3 hover:border-blue-500/50"
            >
              {PRESETS[key].name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleRunInspection} className="glass-panel p-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Flow Parameter Inputs
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Protocol</label>
              <select
                value={formData.protocol_type}
                onChange={(e) => handleInputChange('protocol_type', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Service</label>
              <select
                value={formData.service}
                onChange={(e) => handleInputChange('service', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value="HTTPS">HTTPS</option>
                <option value="HTTP">HTTP</option>
                <option value="SSH">SSH</option>
                <option value="DNS">DNS</option>
                <option value="RDP">RDP</option>
                <option value="C2_Custom">C2_Custom</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">TCP Flag</label>
              <select
                value={formData.flag}
                onChange={(e) => handleInputChange('flag', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value="SF">SF (Established)</option>
                <option value="S0">S0 (SYN No ACK)</option>
                <option value="REJ">REJ (Rejected)</option>
                <option value="RSTO">RSTO (Reset)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Duration (s)</label>
              <input
                type="number" step="0.001"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Source Packets</label>
              <input
                type="number"
                value={formData.src_pkts}
                onChange={(e) => handleInputChange('src_pkts', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Dest Packets</label>
              <input
                type="number"
                value={formData.dst_pkts}
                onChange={(e) => handleInputChange('dst_pkts', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Payload Entropy</label>
              <input
                type="number" step="0.01"
                value={formData.payload_entropy}
                onChange={(e) => handleInputChange('payload_entropy', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Failed Logins</label>
              <input
                type="number"
                value={formData.failed_logins}
                onChange={(e) => handleInputChange('failed_logins', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">IAM Risk Score</label>
              <input
                type="number" step="0.1"
                value={formData.iam_risk_score}
                onChange={(e) => handleInputChange('iam_risk_score', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-2.5 text-xs font-bold"
          >
            {loading ? 'Analyzing with ML Engine...' : 'Run ML Threat Inference'}
          </button>
        </form>

        <div className="glass-panel p-6 space-y-4">
          <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            ML Threat Diagnostics Output
          </h4>

          {result ? (
            <div className="space-y-4 text-xs">
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                result.prediction === 'BENIGN'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div>
                  <span className="text-xs text-slate-400 uppercase">Predicted Threat Vector</span>
                  <h3 className="text-xl font-bold">{result.prediction}</h3>
                  <p className="text-xs mt-1">Classification Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <span className={`badge ${
                    result.severity === 'CRITICAL' ? 'badge-critical' :
                    result.severity === 'HIGH' ? 'badge-high' : 'badge-low'
                  }`}>
                    {result.severity} SEVERITY
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Zero-Day Isolation Forest Index:</span>
                  <p className="text-sm font-bold text-purple-400">{(result.anomaly_score * 100).toFixed(1)}%</p>
                </div>
                <div>
                  {result.is_zero_day_anomaly ? (
                    <span className="badge badge-anomaly">OUTLIER ANOMALY</span>
                  ) : (
                    <span className="text-xs text-slate-400">Normal Profile</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-300 font-semibold">Model Class Probabilities:</span>
                <div className="space-y-1.5">
                  {Object.entries(result.probabilities || {}).map(([clsName, prob]) => (
                    <div key={clsName} className="space-y-0.5">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{clsName}</span>
                        <span>{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${clsName === 'BENIGN' ? 'bg-emerald-400' : 'bg-rose-500'}`}
                          style={{ width: `${prob * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.top_feature_contributions && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-300 font-semibold">Top Feature Drivers (XAI / SHAP):</span>
                  <div className="space-y-1 text-xs">
                    {result.top_feature_contributions.map((fc, i) => (
                      <div key={i} className="flex justify-between bg-slate-900/40 px-2 py-1 rounded text-slate-300">
                        <span className="text-slate-400">{fc.feature}</span>
                        <span className="text-blue-400 font-bold">{fc.contribution_score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Search className="w-8 h-8 mb-2 opacity-50 text-blue-400" />
              <p className="text-xs">Click "Run ML Threat Inference" or select a preset to analyze packet flows.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
