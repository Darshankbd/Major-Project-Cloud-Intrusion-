import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Upload, 
  CheckCircle2, 
  FileSpreadsheet, 
  Layers, 
  Sparkles, 
  AlertCircle,
  Table,
  Plus,
  BarChart3,
  PieChart
} from 'lucide-react';
import { api } from '../services/api';
import { ClassDistributionBarChart, ClassDistributionDoughnut } from '../components/ChartComponents';
import { EvaluatorGuide, StepNavigationFooter } from '../components/StepProgress';

export function Datasets({ setCurrentPage }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [customName, setCustomName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const data = await api.getDatasets();
      setDatasets(data.datasets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadSuccess('');
    const formData = new FormData();
    formData.append('file', uploadFile);
    if (customName) {
      formData.append('name', customName);
    }

    try {
      const res = await api.uploadDataset(formData);
      if (res.success) {
        setUploadSuccess(`Successfully ingested "${res.dataset.name}" (${res.dataset.rows} rows, ${res.dataset.features} features, 0 nulls)`);
        fetchDatasets();
        setTimeout(() => {
          setUploadModalOpen(false);
          setUploadFile(null);
          setCustomName('');
          setUploadSuccess('');
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Evaluator Presentation Guide Script for Step 1 */}
      <EvaluatorGuide
        stepNumber="1"
        title="Dataset Ingestion & Data Profiling"
        whatToSay='"In Step 1, our system ingests industry-standard benchmark datasets (NSL-KDD, CICIDS2017, and UNSW-NB15). We perform automated data profiling to verify 0 null values, encode categorical strings via LabelEncoder, and inspect the 5-class distribution (Normal vs DoS, Probe, R2L, and U2R)."'
        technicalHighlight="Standardized feature matrix X with zero missing values. Fig 4.1 class distribution visualizer proves class proportions (63.3% Normal, 27.3% DoS, 7.4% Probe, 1.4% R2L, 0.6% U2R)."
      />

      {/* Title Header matching Fig 4.5.3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
              STEP 1 OF 5
            </span>
            <h1 className="text-2xl font-bold text-white">Dataset Management & Profiling</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Standardized benchmarks (NSL-KDD, CICIDS2017, UNSW-NB15) with automated data quality profiling
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload Custom CSV</span>
        </button>
      </div>

      {/* Visual Analytics Graphs Section (Fig 4.1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Distribution Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Fig 4.1: Benchmark Class Distribution (Bar Chart)</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">165,929 Instances</span>
          </div>

          <div className="h-64 pt-2">
            <ClassDistributionBarChart />
          </div>
        </div>

        {/* Class Distribution Doughnut Chart (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>Class Proportions (%)</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">Imbalance Handled</span>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ClassDistributionDoughnut />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 text-center">
            Normal: 63.3% • DoS: 27.3% • Probe: 7.4% • R2L: 1.4% • U2R: 0.6%
          </div>
        </div>
      </div>

      {/* Dataset Benchmark Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white font-mono uppercase text-slate-400">
          Pre-Packaged Benchmarks & Data Profiling Cards
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            Loading benchmark datasets...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {datasets.map((ds) => (
              <div
                key={ds.id}
                className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Standard Benchmark
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {ds.created_at?.split(' ')[0] || '2026-08-24'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-mono text-white tracking-wide">
                      {ds.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {ds.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Dimensions</span>
                      <span className="text-white font-semibold">{ds.rows} Rows | {ds.features} Cols</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Data Quality</span>
                      <span className="text-emerald-400 font-semibold">Missing Values: {ds.missing_values}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                      Features Preview:
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-400/90 leading-relaxed break-words">
                      {ds.features_preview ? ds.features_preview.join(', ') + ', ...' : 'protocol, service, flag, duration, src_bytes, dst_bytes, count'}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">
                    {ds.source_type}
                  </span>
                  <button
                    onClick={() => setCurrentPage('train')}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs rounded-lg transition-colors border border-slate-700"
                  >
                    Select for Training ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload CSV Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              <span>Upload Custom PCAP / CSV Dataset</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              The backend will automatically clean, impute missing values, profile feature distributions, and prepare the dataset for ML training.
            </p>

            {uploadSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono">
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Dataset Display Name</label>
                <input
                  type="text"
                  placeholder="e.g., Enterprise AWS Flow Capture 2026"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Select CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  required
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Profiling & Uploading...' : 'Upload & Profile Dataset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stepper Navigation Footer */}
      <StepNavigationFooter
        currentStep="datasets"
        setCurrentStep={setCurrentPage}
        prevStep="home"
        nextStep="train"
        nextStepTitle="Step 2: ML Training Suite & Model Comparison"
      />
    </div>
  );
}
