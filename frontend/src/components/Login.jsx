import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, UserCheck, Key, ArrowRight, Zap, CheckCircle, Sparkles, Building, UserPlus } from 'lucide-react';
import { loginUser, addEmployee } from '../services/api';

const QUICK_DEMO_USERS = [
  {
    email: 'admin@cloudguard.io',
    name: 'Sarah Jenkins',
    title: 'SOC Director & Org Admin',
    role: 'ORG_ADMIN',
    badge: 'SUPER ADMIN',
    color: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
    desc: 'Full access to SOC Command Center, Employee Onboarding & ML Controls'
  },
  {
    email: 'alice@cloudguard.io',
    name: 'Alice Smith',
    title: 'Senior DevOps Lead',
    role: 'EMPLOYEE',
    badge: 'EMPLOYEE PORTAL',
    color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    desc: 'Assigned VM-101 (10.0.1.15), personal posture gauge & incident reporting'
  },
  {
    email: 'bob@cloudguard.io',
    name: 'Bob Jones',
    title: 'IAM & Auth Specialist',
    role: 'EMPLOYEE',
    badge: 'EMPLOYEE PORTAL',
    color: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
    desc: 'Assigned VM-102 (10.0.1.28) with targeted threat analytics'
  },
  {
    email: 'charlie@cloudguard.io',
    name: 'Charlie Brown',
    title: 'Data Infrastructure Lead',
    role: 'EMPLOYEE',
    badge: 'EMPLOYEE PORTAL',
    color: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
    desc: 'Assigned DB-Cluster-01 (10.0.2.55) & private database subnet'
  }
];

export default function Login({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'quick' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Register Form State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('EMPLOYEE');
  const [regDept, setRegDept] = useState('Engineering');
  const [regSuccess, setRegSuccess] = useState('');

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await loginUser(email, password);
      onLoginSuccess(data.user || data);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Try quick demo accounts below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoUser) => {
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        id: demoUser.role === 'ORG_ADMIN' ? 'USR-ADMIN-001' : 'USR-EMP-001',
        email: demoUser.email,
        full_name: demoUser.name,
        role: demoUser.role,
        department: demoUser.title,
        assigned_resources: demoUser.role === 'EMPLOYEE' ? [
          { resource_name: 'Web-Server-01', ip_address: '10.0.1.15', subnet: 'Public Web Subnet (10.0.1.0/24)' }
        ] : []
      });
      setLoading(false);
    }, 400);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPassword) {
      setError('Please fill in all registration fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const newEmp = await addEmployee({
        email: regEmail,
        password: regPassword,
        full_name: regFullName,
        role: regRole,
        department: regDept
      });
      setRegSuccess(`Account successfully created for ${regFullName}! Logging in...`);
      setTimeout(() => {
        onLoginSuccess(newEmp.user || newEmp);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-mono">
      {/* Dynamic Background Effects */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Branding & Highlights Column */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <Shield className="w-4 h-4 animate-pulse" />
            <span>ENTERPRISE SECURITY PLATFORM</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
              Cloud Intrusion <span className="text-blue-400">Detection System</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Next-Generation Cloud Intrusion Detection & Multi-Tenant Employee Security Governance Portal powered by ensemble Machine Learning.
            </p>
          </div>

          {/* Platform Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Zap className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-200">XGBoost & Random Forest Ensemble</p>
                <p className="text-[11px] text-slate-400 font-sans">Real-time ML classification of DDoS, Port Scans, Brute Force, and C2 Malware.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <UserCheck className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-200">Role-Based Access Governance</p>
                <p className="text-[11px] text-slate-400 font-sans">Super Org Admin controls paired with Self-Service Employee security portals.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <Sparkles className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-200">Multi-Channel Alert Dispatches</p>
                <p className="text-[11px] text-slate-400 font-sans">Automated HTML emails, Slack webhooks, and live WebSocket telemetry feeds.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Card Column */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 shadow-2xl space-y-6">
            
            {/* Login / Quick Demo / Register Tabs */}
            <div className="flex items-center justify-between p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => { setActiveTab('login'); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'login' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                Sign In
              </button>

              <button
                onClick={() => { setActiveTab('quick'); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'quick' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Quick Demo Login
              </button>

              <button
                onClick={() => { setActiveTab('register'); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'register' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </button>
            </div>

            {/* Notifications / Errors */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
                <Lock className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            {/* TAB 1: Standard Credentials Login */}
            {activeTab === 'login' && (
              <form onSubmit={handleStandardLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ORGANIZATION EMAIL</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@cloudguard.io or alice@cloudguard.io"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">PASSWORD</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Authenticating Session...</span>
                    ) : (
                      <>
                        <span>Sign In to CloudGuard Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Quick Demo Persona Login */}
            {activeTab === 'quick' && (
              <div className="space-y-3 text-left">
                <p className="text-xs text-slate-400 font-sans">
                  Select a pre-seeded Enterprise persona below for instant 1-click authentication during presentation testing:
                </p>

                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {QUICK_DEMO_USERS.map((user) => (
                    <button
                      key={user.email}
                      type="button"
                      onClick={() => handleQuickLogin(user)}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between group hover:scale-[1.01] ${user.color}`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-100">{user.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-current">
                            {user.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">{user.email} • {user.title}</p>
                        <p className="text-[10px] text-slate-400 font-sans">{user.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Register New Organization or Employee */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3.5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">FULL NAME</label>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. David Miller"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">DEPARTMENT</label>
                    <input
                      type="text"
                      value={regDept}
                      onChange={(e) => setRegDept(e.target.value)}
                      placeholder="e.g. Cyber Security"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">WORK EMAIL</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="david@cloudguard.io"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">PASSWORD</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">ACCOUNT ROLE</label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="EMPLOYEE">Employee (Self-Service Portal)</option>
                      <option value="ORG_ADMIN">Org Admin (Full SOC Access)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                  >
                    {loading ? "Registering User..." : "Create Account & Sign In"}
                  </button>
                </div>
              </form>
            )}

            {/* Footer Notice */}
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>CloudGuard RBAC Auth Engine</span>
              <span>SQLite Persistent Storage</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
