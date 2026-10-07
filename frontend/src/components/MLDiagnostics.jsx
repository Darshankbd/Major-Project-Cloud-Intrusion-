import React, { useState } from 'react';
import { Cpu, RefreshCw, BarChart2 } from 'lucide-react';
import { triggerRetrain } from '../services/api';

export default function MLDiagnostics({ mlMetrics, onRefreshMetrics }) {
  const [retraining, setRetraining] = useState(false);
  const [retrainMsg, setRetrainMsg] = useState(null);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainMsg("Retraining models in background...");
    try {
      await triggerRetrain();
      setRetrainMsg("Retraining complete! Reloading metrics...");
      setTimeout(() => {
        if (onRefreshMetrics) onRefreshMetrics();
        setRetrainMsg(null);
        setRetraining(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      setRetrainMsg("Retraining error");
      setRetraining(false);
    }
  };

  const metricsMap = mlMetrics?.metrics || {};
  const featureImportances = mlMetrics?.feature_importances || [];

  return (
    <div className="space-y-6 font-mono">
      <div className="glass-panel p-5 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            Machine Learning Engine Diagnostics & Benchmarks
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Performance comparison of Supervised Classifiers (Random Forest, XGBoost, Logistic Baseline) and Unsupervised Anomaly Detection (Isolation Forest).
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="btn btn-primary text-xs py-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
          {retraining ? 'Retraining ML Models...' : 'Retrain Pipeline'}
        </button>
      </div>

      {retrainMsg && (
        <div className="p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-300 text-xs font-mono">
          {retrainMsg}
        </div>
      )}

      <div className="glass-panel p-6 lg:p-8 space-y-4">
        <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
          Algorithm Comparison Matrix
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3.5">Model Architecture</th>
                <th className="p-3.5">Model Type</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">Precision</th>
                <th className="p-3.5">Recall</th>
                <th className="p-3.5">F1-Score</th>
                <th className="p-3.5">ROC-AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.keys(metricsMap).map((mKey) => {
                const info = metricsMap[mKey];
                const isBest = mKey === 'xgboost' || mKey === 'random_forest';
                return (
                  <tr key={mKey} className={`hover:bg-slate-800/40 ${isBest ? 'bg-blue-500/5' : ''}`}>
                    <td className="p-3.5 font-bold text-slate-200 capitalize">
                      {mKey.replace('_', ' ')} {isBest && <span className="text-[10px] text-blue-400 font-normal">(Optimal)</span>}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {info.type === 'supervised_classifier' ? 'Supervised' : 'Unsupervised Anomaly'}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">{(info.accuracy * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-slate-300">{(info.precision * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-slate-300">{(info.recall * 100).toFixed(1)}%</td>
                    <td className="p-3.5 font-bold text-blue-400">{(info.f1_score * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-purple-400 font-bold">
                      {info.roc_auc ? (info.roc_auc * 100).toFixed(1) + '%' : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-panel p-6 lg:p-8 space-y-4">
        <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
          <BarChart2 className="w-4 h-4 text-blue-400" />
          Random Forest Top Feature Importance Ranking
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {featureImportances.slice(0, 10).map((fi, i) => (
            <div key={i} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-300">{fi.feature}</span>
                <span className="text-blue-400 font-bold">{(fi.importance * 100).toFixed(2)}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  style={{ width: `${Math.min(fi.importance * 300, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
