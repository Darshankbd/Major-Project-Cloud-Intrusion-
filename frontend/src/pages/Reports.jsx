import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  GitBranch, 
  Cpu, 
  Network, 
  Terminal, 
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { api } from '../services/api';

export function Reports() {
  const [activeDiagramTab, setActiveDiagramTab] = useState('flow');

  return (
    <div className="space-y-8 py-4">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Executive Incident, Architecture & Compliance Reports</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Visual system representations, mathematical formulation matrices, and automated ReportLab PDF downloads
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={api.getCsvReportUrl()}
            download
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </a>

          <a
            href={api.getPdfReportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-500/25"
          >
            <Download className="w-4 h-4" />
            <span>Generate Executive PDF</span>
          </a>
        </div>
      </div>

      {/* Interactive Diagrammatic Representation Showcase */}
      <div className="p-6 rounded-2xl bg-[#0d1424] border border-cyan-500/25 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono">
              System Architecture & Diagrammatic Model Representations
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => setActiveDiagramTab('flow')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeDiagramTab === 'flow' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Level-1 DFD Flow
            </button>
            <button
              onClick={() => setActiveDiagramTab('matrix')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeDiagramTab === 'matrix' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Formulation Matrix
            </button>
            <button
              onClick={() => setActiveDiagramTab('taxonomy')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeDiagramTab === 'taxonomy' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Threat Taxonomy Tree
            </button>
            <button
              onClick={() => setActiveDiagramTab('defense')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeDiagramTab === 'defense' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Perimeter Defense Model
            </button>
          </div>
        </div>

        {/* TAB 1: Level-1 DFD Architecture Representation */}
        {activeDiagramTab === 'flow' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              <b>Level-1 Data Flow Diagram (DFD):</b> Illustrates how raw network telemetry flows across the 4 stages from collection to automated mitigation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
              {/* Stage 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group hover:border-cyan-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                    1.0
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Ingress</span>
                </div>
                <h3 className="text-sm font-bold text-white">Data Collection</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Collects network flow logs, connection duration, protocol headers, and VPC packets.
                </p>
                <div className="p-2 rounded bg-slate-900 text-cyan-300 text-[10px]">
                  Output: Raw telemetry vector (X)
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                    2.0
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Pipeline</span>
                </div>
                <h3 className="text-sm font-bold text-white">Preprocessing & Scaling</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Missing value imputation, categorical LabelEncoder, and StandardScaler normalization.
                </p>
                <div className="p-2 rounded bg-slate-900 text-blue-300 text-[10px]">
                  Formula: X' = (X - μ) / σ
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    3.0
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">AI Engine</span>
                </div>
                <h3 className="text-sm font-bold text-white">Random Forest Classifier</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  100 estimator trees evaluate Gini splits and aggregate majority bagging consensus.
                </p>
                <div className="p-2 rounded bg-slate-900 text-emerald-300 text-[10px]">
                  Output: Predicted Y ∈ &#123;Normal, DoS, Probe, R2L, U2R&#125;
                </div>
              </div>

              {/* Stage 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative group hover:border-rose-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-xs">
                    4.0
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Response</span>
                </div>
                <h3 className="text-sm font-bold text-white">Mitigation & Alert</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Auto-generates iptables DROP and AWS NACL 50 rules to isolate the malicious IP.
                </p>
                <div className="p-2 rounded bg-slate-900 text-rose-300 text-[10px]">
                  Action: iptables -I INPUT -s &lt;IP&gt; -j DROP
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Mathematical Formulation Matrix */}
        {activeDiagramTab === 'matrix' && (
          <div className="space-y-4 font-mono text-xs">
            <p className="text-slate-400">
              <b>Mathematical Formulation Matrix (Section 4.4):</b> Maps each functional component to its rigorous algorithmic and logical representation.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800">
                <thead className="bg-slate-900 text-slate-400 text-[11px]">
                  <tr>
                    <th className="p-3 border border-slate-800">COMPONENT</th>
                    <th className="p-3 border border-slate-800">FORMULATION / REPRESENTATION</th>
                    <th className="p-3 border border-slate-800">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">Input Traffic Data</td>
                    <td className="p-3 text-cyan-300">X = &#123;x₁, x₂, ..., xₙ&#125;</td>
                    <td className="p-3 text-slate-400">Network flow records collected from NSL-KDD, CICIDS2017, and UNSW-NB15.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">Preprocessing</td>
                    <td className="p-3 text-cyan-300">X' = P(X) = StandardScaler(LabelEncoder(X))</td>
                    <td className="p-3 text-slate-400">Missing value imputation, categorical encoding, and feature standardization.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">Gini Impurity</td>
                    <td className="p-3 text-cyan-300">Gini(D) = 1 - ∑ (pᵢ)²</td>
                    <td className="p-3 text-slate-400">Purity metric used to determine optimal decision tree splitting thresholds.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">Random Forest Voting</td>
                    <td className="p-3 text-cyan-300">Ŷ = argmax_y ∑ I(hₜ(X') = y)</td>
                    <td className="p-3 text-slate-400">Combines predictions across 100 independent decision trees via majority consensus.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">Anomaly Decision</td>
                    <td className="p-3 text-rose-300">A = 1 if Ŷ ≠ Normal, else A = 0</td>
                    <td className="p-3 text-slate-400">Flags vector as an intrusion whenever an attack category is predicted.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">F1-Score Metric</td>
                    <td className="p-3 text-emerald-300">F1 = 2 × (Precision × Recall) / (Precision + Recall)</td>
                    <td className="p-3 text-slate-400">Harmonic mean providing balanced evaluation on imbalanced class distributions.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Threat Taxonomy Tree */}
        {activeDiagramTab === 'taxonomy' && (
          <div className="space-y-5 font-mono text-xs">
            <p className="text-slate-400">
              <b>Multi-Class Threat Taxonomy & Behavioral Signatures:</b> Shows the decision boundary partitioning between legitimate traffic and specific attack vectors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>1. Normal Traffic</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20">63.3% Baseline</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  • Zero failed logins (`num_failed_logins = 0`)<br/>
                  • Established connection flag (`SF`)<br/>
                  • Symmetric request/response byte ratios
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-rose-400 font-bold">
                  <span>2. DoS (Denial of Service)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20">High Severity</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  • High connection rate (`count &gt; 300`)<br/>
                  • Half-open SYN sent with no reply (`flag = S0`)<br/>
                  • SYN error rate (`serror_rate = 1.0`)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>3. Probe (Port Sweeps)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20">Medium Severity</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  • Rapid destination port cycling<br/>
                  • High connection rejection rate (`flag = REJ`)<br/>
                  • Minimal byte payload transfers (`src_bytes = 44`)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>4. R2L (Unauthorized Access)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20">High Severity</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  • Repeated failed authentications (`num_failed_logins ≥ 3`)<br/>
                  • Remote target services (`ftp`, `ssh`, `telnet`)<br/>
                  • Extended interactive duration (`15s - 80s`)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-purple-400 font-bold">
                  <span>5. U2R (Privilege Escalation)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20">Critical Severity</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  • Compromised file system indicators (`num_compromised ≥ 1`)<br/>
                  • High outbound shellcode payload (`src_bytes &gt; 2000`)<br/>
                  • Root binary exploitation (`hot ≥ 1`)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/30 space-y-2 flex flex-col justify-between">
                <div className="text-blue-400 font-bold">
                  <span>Gini Decision Partitioning</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tree splits evaluate multi-dimensional vectors recursively to assign probability confidence ratings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Perimeter Defense Model */}
        {activeDiagramTab === 'defense' && (
          <div className="space-y-5 font-mono text-xs">
            <p className="text-slate-400">
              <b>Automated Perimeter Defense & Cloud Mitigation Architecture:</b> Explains how the ML engine interfaces with Linux kernel firewalls and cloud VPC controllers.
            </p>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">1. Linux Host Defense</div>
                  <code className="text-emerald-400 text-[10px] block break-all">
                    iptables -I INPUT -s &lt;ATTACKER_IP&gt; -j DROP
                  </code>
                  <p className="text-[10px] text-slate-400 mt-1">Discards malicious packets at kernel Netfilter hook.</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">2. AWS NACL 50 Enforcement</div>
                  <code className="text-cyan-300 text-[10px] block">
                    RuleNumber: 50 | Action: DENY | Cidr: IP/32
                  </code>
                  <p className="text-[10px] text-slate-400 mt-1">Stops traffic at VPC subnet boundary before compute instances.</p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">3. Cloudflare / WAF Rules</div>
                  <code className="text-purple-300 text-[10px] block">
                    Mode: Block | Target: IP | Zone: Cloud-IDS
                  </code>
                  <p className="text-[10px] text-slate-400 mt-1">Perimeter HTTP/S edge discard preventing application overload.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Download Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Executive Report Card */}
        <div className="p-6 rounded-2xl bg-[#0d1424] border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white font-mono">
                Executive Cybersecurity Audit Report (.PDF)
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Compiled dynamically with Python ReportLab. Includes architecture flow diagrams, mathematical matrices, multi-class threat breakdowns, active alert tables, and perimeter firewall remediation logs.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
              <div className="text-cyan-400 font-semibold">• Document Structure in PDF:</div>
              <div className="text-slate-400 text-[11px]">1. System Architecture & Detection Data Flow Diagram (DFD Level-1)</div>
              <div className="text-slate-400 text-[11px]">2. Mathematical Formulation & Anomaly Decision Matrix</div>
              <div className="text-slate-400 text-[11px]">3. Multi-Class Threat Taxonomy & Behavioral Signatures</div>
              <div className="text-slate-400 text-[11px]">4. Critical Threat Detections & Automated Firewall Audit Log</div>
            </div>
          </div>

          <a
            href={api.getPdfReportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 text-center"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Executive PDF Report</span>
          </a>
        </div>

        {/* CSV Telemetry Audit Card */}
        <div className="p-6 rounded-2xl bg-[#0d1424] border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileSpreadsheet className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white font-mono">
                Raw Telemetry Audit Feed (.CSV)
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Complete structured dump of all historical inspected packet vectors, timestamps, protocols, services, machine learning predictions, confidence ratings, and source IPs.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
              <div className="text-emerald-400 font-semibold">• Data Compatibility:</div>
              <div className="text-slate-400 text-[11px]">• Splunk / Elastic SIEM Ingestion Ready</div>
              <div className="text-slate-400 text-[11px]">• Pandas & Jupyter Notebook Analytics Ready</div>
            </div>
          </div>

          <a
            href={api.getCsvReportUrl()}
            download
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold font-mono text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-center"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Full CSV Dataset</span>
          </a>
        </div>
      </div>
    </div>
  );
}
