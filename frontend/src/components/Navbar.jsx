import React from 'react';
import { LayoutDashboard, Radio, Search, AlertTriangle, Cpu, Network, Users, Bell, UserCheck, Target } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeAlertCount, userRole = 'ORG_ADMIN' }) {
  const adminTabs = [
    { id: 'overview', label: 'SOC Command Center', icon: LayoutDashboard },
    { id: 'objectives', label: 'Project Objectives', icon: Target },
    { id: 'employees', label: 'Employee Management', icon: Users },
    { id: 'live', label: 'Live Traffic Stream', icon: Radio },
    { id: 'inspector', label: 'Packet Inspector', icon: Search },
    { 
      id: 'incidents', 
      label: 'Incidents & Mitigation', 
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : null 
    },
    { id: 'notifications', label: 'Notifications & Webhooks', icon: Bell },
    { id: 'analytics', label: 'ML Analytics', icon: Cpu },
    { id: 'topology', label: 'Cloud Topology', icon: Network },
  ];

  const employeeTabs = [
    { id: 'employee_portal', label: 'My Security Portal', icon: UserCheck },
    { id: 'objectives', label: 'Project Objectives', icon: Target },
    { id: 'live', label: 'Live Traffic Stream', icon: Radio },
    { id: 'inspector', label: 'Packet Inspector', icon: Search },
  ];

  const tabs = userRole === 'ORG_ADMIN' ? adminTabs : employeeTabs;

  return (
    <nav className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-500/10 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
