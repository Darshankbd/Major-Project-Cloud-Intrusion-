import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Download, 
  Play, 
  Award, 
  CheckSquare, 
  Square, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  BarChart2
} from 'lucide-react';
import { api } from '../services/api';
import { ModelComparisonBarChart } from '../components/ChartComponents';

export function TrainML({ setCurrentPage }) {
  const [selectedDataset, setSelectedDataset] = useState('nsl-kdd');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([
    'Random Forest',
    'Decision Tree'
  ]);
  const [datasetsList, setDatasetsList] = useState([]);
  const [trainingResults, setTrainingResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableAlgorithms = [
    'Random Forest',
    'Decision Tree',
    'Support Vector Machine',
    'K-Nearest Neighbors',
    'Naive Bayes'
  ];

  const fetchInitialData = async () => {
    try {
      const dsData = await api.getDatasets();
      if (dsData.datasets) {
        setDatasetsList(dsData.datasets);
      }
      const confData = await api.getConfusionMatrix(selectedDataset);
      if (confData && confData.comparison) {
        setTrainingResults(confData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const toggleAlgorithm = (algo) => {
    if (selectedAlgorithms.includes(algo)) {
      if (selectedAlgorithms.length > 1) {
        setSelectedAlgorithms(selectedAlgorithms.filter(a => a !== algo));
      }
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algo]);
    }
  };

  const handleTrain = async () => {
    setLoading(true);
    try {
      const res = await api.trainModels(selectedDataset, selectedAlgorithms);
      if (res.success && res.results) {
        setTrainingResults(res.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const winnerModel = trainingResults?.winner || 'Random Forest';

  return (
    <div className="space-y-8 py-4">
      {/* Title Header matching Fig 4.5.4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Machine Learning Training Suite & Comparison</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Preprocess, scale features, train classifiers, auto-compare metrics, and serialize top .joblib model
          </p>
        </div>

        {/* Download Winning Model Button */}
        <a
          href={api.getModelDownloadUrl(selectedDataset, winnerModel)}
          download
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold transition-all shadow-md w-fit"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Download Model (.joblib)</span>
        </a>
      </div>

      {/* Interactive Visual Graph: Model Comparison Bar Chart */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>Interactive Algorithm Benchmark Comparison (Accuracy, Precision, Recall, F1)</span>
          </h2>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Winner: {winnerModel}</span>
          </div>
        </div>

        <div className="h-64 pt-2">
          <ModelComparisonBarChart comparisonData={trainingResults?.comparison} />
        </div>
      </div>

      {/* Main 2-Column Training Grid matching Fig 4.5.4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Training Configuration (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Training Configuration</span>
            </h2>

            {/* Select Dataset Baseline */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="block text-slate-300 font-semibold">Select Dataset Baseline</label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="nsl-kdd">NSL-KDD Sample Dataset (Connection-Level)</option>
                <option value="cicids2017">CICIDS2017 Modern Flow Dataset</option>
                <option value="unsw-nb15">UNSW-NB15 Hybrid Dataset</option>
                {datasetsList
                  .filter(d => !['nsl-kdd', 'cicids2017', 'unsw-nb15'].includes(d.id))
                  .map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))
                }
              </select>
            </div>

            {/* Include ML Algorithms Checkboxes */}
            <div className="space-y-2 font-mono text-xs">
              <label className="block text-slate-300 font-semibold">Include ML Algorithms</label>
              <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                {availableAlgorithms.map((algo) => {
                  const isChecked = selectedAlgorithms.includes(algo);
                  return (
                    <button
                      type="button"
                      key={algo}
                      onClick={() => toggleAlgorithm(algo)}
                      className="flex items-center gap-2.5 w-full text-left py-1 text-slate-300 hover:text-white transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className={isChecked ? 'text-white font-medium' : 'text-slate-500'}>
                        {algo}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <button
            onClick={handleTrain}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Fitting Scikit-Learn Classifiers...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Train & Compare Models</span>
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Model Comparison Matrix (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Model Comparison Matrix</span>
            </h2>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Top Model: {winnerModel}</span>
            </div>
          </div>

          {/* Matrix Table matching Fig 4.5.4 */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/90 text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">ALGORITHM</th>
                  <th className="py-2.5 px-3">ACCURACY</th>
                  <th className="py-2.5 px-3">PRECISION</th>
                  <th className="py-2.5 px-3">RECALL</th>
                  <th className="py-2.5 px-3">F1-SCORE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {trainingResults?.comparison ? (
                  trainingResults.comparison.map((row) => {
                    const isWinner = row.algorithm === winnerModel;
                    return (
                      <tr 
                        key={row.algorithm}
                        className={`transition-colors ${
                          isWinner ? 'bg-cyan-500/10 font-bold' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-3 flex items-center gap-2">
                          {isWinner && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>}
                          <span className={isWinner ? 'text-cyan-300' : 'text-slate-300'}>
                            {row.algorithm}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-200">{row.accuracy}%</td>
                        <td className="py-3 px-3 text-slate-200">{row.precision}%</td>
                        <td className="py-3 px-3 text-slate-200">{row.recall}%</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">{row.f1_score}%</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      Click "Train & Compare Models" to initiate scikit-learn cross-validation.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Model Deployment Summary Notice */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Production Pipeline Status</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Winning classifier <b className="text-white">{winnerModel}</b> is automatically activated for real-time telemetry inspection and exploit sandbox simulations. Serialized <code className="text-cyan-300">.joblib</code> payload includes StandardScaler parameters and LabelEncoder state vectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
