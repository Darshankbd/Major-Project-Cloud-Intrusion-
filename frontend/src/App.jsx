import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Login from './components/Login';
import CommandCenter from './components/CommandCenter';
import LiveMonitor from './components/LiveMonitor';
import PacketInspector from './components/PacketInspector';
import IncidentsHub from './components/IncidentsHub';
import MLDiagnostics from './components/MLDiagnostics';
import CloudTopology from './components/CloudTopology';
import EmployeeManagement from './components/EmployeeManagement';
import EmployeeDashboard from './components/EmployeeDashboard';
import NotificationSettings from './components/NotificationSettings';
import ProjectObjectives from './components/ProjectObjectives';
import GuardAIChat from './components/GuardAIChat';
import { Bot } from 'lucide-react';
import { 
  createWebSocketStream, 
  fetchTrafficStatus, 
  startTrafficSimulator, 
  stopTrafficSimulator, 
  fetchAlerts, 
  fetchMLMetrics 
} from './services/api';

const DEFAULT_USERS = {
  'admin@cloudguard.io': {
    id: 'USR-ADMIN-001',
    email: 'admin@cloudguard.io',
    full_name: 'Sarah Jenkins (SOC Director)',
    role: 'ORG_ADMIN',
    department: 'Global Cyber Command'
  },
  'alice@cloudguard.io': {
    id: 'USR-EMP-001',
    email: 'alice@cloudguard.io',
    full_name: 'Alice Smith',
    role: 'EMPLOYEE',
    department: 'DevOps Engineering',
    assigned_resources: [
      { resource_name: 'Web-Server-01', ip_address: '10.0.1.15', subnet: 'Public Web Subnet (10.0.1.0/24)' }
    ]
  },
  'bob@cloudguard.io': {
    id: 'USR-EMP-002',
    email: 'bob@cloudguard.io',
    full_name: 'Bob Jones',
    role: 'EMPLOYEE',
    department: 'IAM & Authentication',
    assigned_resources: [
      { resource_name: 'Auth-Server-02', ip_address: '10.0.1.28', subnet: 'Public Web Subnet (10.0.1.0/24)' }
    ]
  },
  'charlie@cloudguard.io': {
    id: 'USR-EMP-003',
    email: 'charlie@cloudguard.io',
    full_name: 'Charlie Brown',
    role: 'EMPLOYEE',
    department: 'Data Infrastructure',
    assigned_resources: [
      { resource_name: 'DB-Cluster-01', ip_address: '10.0.2.55', subnet: 'Private DB Subnet (10.0.2.0/24)' }
    ]
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // null means show Login screen
  const [activeTab, setActiveTab] = useState('overview');
  const [isSimulating, setIsSimulating] = useState(true);
  const [liveLogs, setLiveLogs] = useState([]);
  const [stats, setStats] = useState({ generated_count: 0, threat_count: 0 });
  const [alerts, setAlerts] = useState({ summary: {}, alerts: [] });
  const [mlMetrics, setMlMetrics] = useState(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [theme, setTheme] = useState('midnight');

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'EMPLOYEE') {
      setActiveTab('employee_portal');
    } else {
      setActiveTab('overview');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cloudguard_user');
  };

  const handlePersonaSwitch = (email) => {
    const user = DEFAULT_USERS[email] || DEFAULT_USERS['admin@cloudguard.io'];
    setCurrentUser(user);
    if (user.role === 'EMPLOYEE') {
      setActiveTab('employee_portal');
    } else {
      setActiveTab('overview');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const loadBackendData = async () => {
    try {
      const statusData = await fetchTrafficStatus();
      setStats(statusData);
      setIsSimulating(statusData.is_running);

      const alertData = await fetchAlerts();
      setAlerts(alertData);

      const metricsData = await fetchMLMetrics();
      setMlMetrics(metricsData);
    } catch (e) {
      console.error("Backend fetch error", e);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    loadBackendData();

    const ws = createWebSocketStream((newFlow) => {
      setLiveLogs((prevLogs) => [newFlow, ...prevLogs.slice(0, 100)]);
      setStats((prevStats) => ({
        ...prevStats,
        generated_count: prevStats.generated_count + 1,
        threat_count: newFlow.severity !== 'LOW' ? prevStats.threat_count + 1 : prevStats.threat_count
      }));

      if (newFlow.severity === 'CRITICAL' || newFlow.severity === 'HIGH') {
        fetchAlerts().then(setAlerts).catch(console.error);
      }
    });

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleToggleSimulator = async () => {
    try {
      if (isSimulating) {
        await stopTrafficSimulator();
        setIsSimulating(false);
      } else {
        await startTrafficSimulator();
        setIsSimulating(true);
      }
    } catch (e) {
      console.error("Failed to toggle simulator", e);
    }
  };

  const handleSpeedChange = async (interval) => {
    try {
      await fetch('http://127.0.0.1:8000/api/traffic/speed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval })
      });
    } catch (e) {
      console.error("Failed to update simulator speed", e);
    }
  };

  const activeAlertCount = alerts?.summary?.active || 0;

  // Render Login interface if user is not authenticated
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:px-12 lg:py-8 max-w-[1520px] mx-auto space-y-8 relative transition-colors duration-500">
      {/* Header */}
      <Header
        isSimulating={isSimulating}
        onToggleSimulator={handleToggleSimulator}
        generatedCount={stats.generated_count}
        threatCount={stats.threat_count}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        currentUser={currentUser}
        onPersonaSwitch={handlePersonaSwitch}
        onLogout={handleLogout}
      />

      {/* Navigation Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAlertCount={activeAlertCount}
        userRole={currentUser.role}
      />

      {/* Main Content View Switcher */}
      <main className="space-y-8">
        {activeTab === 'overview' && (
          <CommandCenter
            stats={stats}
            liveLogs={liveLogs}
            alerts={alerts}
            mlMetrics={mlMetrics}
            onSpeedChange={handleSpeedChange}
          />
        )}

        {activeTab === 'objectives' && (
          <ProjectObjectives onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'employees' && (
          <EmployeeManagement />
        )}

        {activeTab === 'employee_portal' && (
          <EmployeeDashboard currentUser={currentUser} liveLogs={liveLogs} />
        )}

        {activeTab === 'live' && (
          <LiveMonitor liveLogs={liveLogs} />
        )}

        {activeTab === 'inspector' && (
          <PacketInspector />
        )}

        {activeTab === 'incidents' && (
          <IncidentsHub
            alerts={alerts}
            onRefreshAlerts={() => fetchAlerts().then(setAlerts)}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings />
        )}

        {activeTab === 'analytics' && (
          <MLDiagnostics
            mlMetrics={mlMetrics}
            onRefreshMetrics={() => fetchMLMetrics().then(setMlMetrics)}
          />
        )}

        {activeTab === 'topology' && (
          <CloudTopology alerts={alerts} />
        )}
      </main>

      {/* Floating GuardAI Assistant Trigger Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className="p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:scale-105 transition flex items-center gap-2 font-mono text-xs font-bold border border-blue-400/40"
        >
          <Bot className="w-5 h-5 animate-bounce" />
          <span>GuardAI Specialist</span>
        </button>
      </div>

      {/* GuardAI Chat Modal */}
      <GuardAIChat
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
      />

      {/* Global Footer */}
      <footer className="pt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
        <p>Cloud Intrusion Detection System — Enterprise Organization & Employee Intrusion Defense Platform</p>
        <p>Built with FastAPI • SQLite RBAC • XGBoost • Scikit-Learn • React • WebSockets</p>
      </footer>
    </div>
  );
}
