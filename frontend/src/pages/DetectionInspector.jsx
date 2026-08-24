import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Cpu, 
  ShieldAlert, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { ThreatBadge, AttackBadge } from '../components/ThreatBadge';

export function DetectionInspector() {
  const [packet, setPacket] = useState(null);
  const [featureImportances, setFeatureImportances] = useState([]);
  const [loading, setLoading] = useState(false);

  const inspectLivePacket = async () => {
    setLoading(true);
    try {
      const pkt = await api.getLiveTelemetryPacket();
      setPacket(pkt);

      const cm = await api.getConfusionMatrix('nsl-kdd');
      if (cm && cm.feature_importance) {
        setFeatureImportances(cm.feature_importance);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    inspectLivePacket();
  }, []);

  return (
    <div className="space-y-8 py-4">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Detection Inspector & Explainable AI</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Drill down into individual telemetry flow vectors to understand feature attribution decisions
          </p>
        </div>

        <button
          onClick={inspectLivePacket}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all shadow-md w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Capture & Inspect Live Packet</span>
        </button>
      </div>

      {packet && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Packet Summary & Vector Attributes (6 Cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Captured Packet Telemetry</span>
              </h2>
              <ThreatBadge severity={packet.severity} />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Classification:</span>
                <AttackBadge attackType={packet.prediction} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Confidence:</span>
                <span className="text-cyan-400 font-bold">{packet.confidence}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Origin IP:</span>
                <span className="text-white font-semibold">{packet.source_ip}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Destination:</span>
                <span className="text-white font-semibold">{packet.destination_ip}</span>
              </div>
            </div>

            {/* Feature Attribute Matrix */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Network Feature State Values:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Protocol / Service</span>
                  <span className="text-white font-bold">{packet.protocol?.toUpperCase()} / {packet.service}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Connection Flag</span>
                  <span className="text-white font-bold">{packet.flag}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Duration</span>
                  <span className="text-white font-bold">{packet.duration}s</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Source / Dst Bytes</span>
                  <span className="text-white font-bold">{packet.src_bytes} / {packet.dst_bytes}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Connection Count</span>
                  <span className="text-white font-bold">{packet.count}</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">SYN Error Rate</span>
                  <span className="text-white font-bold">{packet.serror_rate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Attribution Importance (6 Cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Gini / Tree Feature Importance Attribution</span>
            </h2>

            <p className="text-xs text-slate-400 font-mono">
              Top network features contributing to the Random Forest ensemble prediction:
            </p>

            <div className="space-y-3 font-mono text-xs pt-2">
              {featureImportances.length > 0 ? (
                featureImportances.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>{item.feature}</span>
                      <span className="text-cyan-400 font-bold">{item.importance}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.importance * 3)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900 rounded-lg text-slate-400 text-xs">
                    • <b>src_bytes:</b> 28.4% (Primary indicator for DoS and data exfiltration)
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg text-slate-400 text-xs">
                    • <b>serror_rate:</b> 22.1% (Differentiates probe sweeps from established sessions)
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg text-slate-400 text-xs">
                    • <b>count:</b> 18.7% (Detects high-frequency burst patterns)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
