import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  GitBranch,
  Shield,
  Activity,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import { StepNavigationFooter } from '../components/StepProgress';

export function Reports({ setCurrentPage }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [activeModelTab, setActiveModelTab] = useState('dfd');

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const blob = await api.downloadPdfReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Cloud_IDS_Phase1_Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
              STEP 5 OF 5 • CONCLUSION
            </span>
            <h1 className="text-2xl font-bold text-white">Phase 1 Audit Report & Compliance</h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Dynamic Python ReportLab PDF compiler, mathematical matrices (FR01–FR12), and Review 2 roadmap
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 w-fit cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{downloadingPdf ? 'Compiling PDF...' : 'Download Executive PDF Report'}</span>
        </button>
      </div>

      {/* Model Diagrammatic Tabs */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Diagrammatic Architecture & Formulation Models
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveModelTab('dfd')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeModelTab === 'dfd' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Level-1 DFD
            </button>
            <button
              onClick={() => setActiveModelTab('math')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeModelTab === 'math' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Formulation Matrix
            </button>
            <button
              onClick={() => setActiveModelTab('threats')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeModelTab === 'threats' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Threat Taxonomy
            </button>
            <button
              onClick={() => setActiveModelTab('defense')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeModelTab === 'defense' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Perimeter Defense
            </button>
          </div>
        </div>

        {/* TAB 1: DFD Level-1 Flow */}
        {activeModelTab === 'dfd' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <div className="text-cyan-400 font-bold text-sm">Stage 1.0</div>
                <div className="text-white font-bold">Data Collection & Ingress</div>
                <p className="text-[11px] text-slate-400">
                  Captures NetFlow & benchmark logs (NSL-KDD, CICIDS2017) ➔ Raw Vector X.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2">
                <div className="text-blue-400 font-bold text-sm">Stage 2.0</div>
                <div className="text-white font-bold">Preprocessing & Scaling</div>
                <p className="text-[11px] text-slate-400">
                  Imputes missing values, encodes categories, scales features (z = (x - μ) / σ).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="text-purple-400 font-bold text-sm">Stage 3.0</div>
                <div className="text-white font-bold">ML Ensemble Inference</div>
                <p className="text-[11px] text-slate-400">
                  100-Tree Random Forest majority voting evaluates Gini impurity splits.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="text-emerald-400 font-bold text-sm">Stage 4.0</div>
                <div className="text-white font-bold">Automated Mitigation</div>
                <p className="text-[11px] text-slate-400">
                  Synthesizes `iptables` drop rules & AWS NACL 50 policies for instant IP containment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Mathematical Formulation */}
        {activeModelTab === 'math' && (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border border-slate-800">
              <thead className="bg-slate-900 text-slate-400 text-[10px]">
                <tr>
                  <th className="p-3 border border-slate-800">MODULE / CODE</th>
                  <th className="p-3 border border-slate-800">MATHEMATICAL FORMULATION</th>
                  <th className="p-3 border border-slate-800">OPERATIONAL ROLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 border border-slate-800 font-bold text-cyan-400">FR01: Standardization</td>
                  <td className="p-3 border border-slate-800 text-slate-200">X' = (X - μ) / σ</td>
                  <td className="p-3 border border-slate-800 text-slate-400">Unit-variance scaling prevents numerical domination</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-800 font-bold text-purple-400">FR02: Gini Impurity</td>
                  <td className="p-3 border border-slate-800 text-slate-200">Gini(D) = 1 - Σ (p_i)²</td>
                  <td className="p-3 border border-slate-800 text-slate-400">Splitting criterion for decision tree node optimization</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-800 font-bold text-emerald-400">FR03: Bagging Consensus</td>
                  <td className="p-3 border border-slate-800 text-slate-200">Y_hat = argmax Σ I(h_t(X) = y)</td>
                  <td className="p-3 border border-slate-800 text-slate-400">100-Tree ensemble majority voting aggregation</td>
                </tr>
                <tr>
                  <td className="p-3 border border-slate-800 font-bold text-rose-400">FR04: Anomaly Decision</td>
                  <td className="p-3 border border-slate-800 text-slate-200">A = 1 if Y_hat ≠ Normal</td>
                  <td className="p-3 border border-slate-800 text-slate-400">Flags vector as malicious intrusion triggering firewall</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: Threat Taxonomy */}
        {activeModelTab === 'threats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
              <div className="text-rose-400 font-bold">1. DoS (Denial of Service)</div>
              <p className="text-[11px] text-slate-400">• High connection rate (`count &gt; 300`)<br/>• Half-open SYN state (`flag = S0`)<br/>• Zero destination bytes</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <div className="text-cyan-400 font-bold">2. R2L (Unauthorized Access)</div>
              <p className="text-[11px] text-slate-400">• Failed logins (`num_failed_logins ≥ 4`)<br/>• Remote authentication (`ftp`, `ssh`, `telnet`)<br/>• Interactive duration (15s - 80s)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
              <div className="text-purple-400 font-bold">3. U2R (Privilege Escalation)</div>
              <p className="text-[11px] text-slate-400">• Compromised file system indicators<br/>• Outbound shellcode (`src_bytes &gt; 2000`)<br/>• Sudo root binary exploitation</p>
            </div>
          </div>
        )}

        {/* TAB 4: Perimeter Defense */}
        {activeModelTab === 'defense' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="text-emerald-400 font-bold">Linux Netfilter Layer</div>
              <pre className="p-2 bg-slate-900 rounded text-cyan-300 text-[10px]">
                <code>iptables -I INPUT -s &lt;ATTACKER_IP&gt; -j DROP</code>
              </pre>
              <p className="text-[11px] text-slate-400">Kernel-level silent packet discard with zero CPU overhead.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <div className="text-cyan-400 font-bold">Cloud VPC Network ACL</div>
              <pre className="p-2 bg-slate-900 rounded text-cyan-300 text-[10px]">
                <code>aws ec2 create-network-acl-entry --rule-number 50 --rule-action deny</code>
              </pre>
              <p className="text-[11px] text-slate-400">Cloud perimeter subnet boundary block across all availability zones.</p>
            </div>
          </div>
        )}
      </div>

      {/* Stepper Navigation Footer */}
      <StepNavigationFooter
        currentStep="reports"
        setCurrentStep={setCurrentPage}
        prevStep="sandbox"
        nextStep={null}
        nextStepTitle=""
      />
    </div>
  );
}
