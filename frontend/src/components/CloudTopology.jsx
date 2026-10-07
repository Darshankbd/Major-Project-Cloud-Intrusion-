import React from 'react';
import { Network, Server, Shield, Cloud, CheckCircle } from 'lucide-react';

export default function CloudTopology({ alerts }) {
  const activeThreats = alerts?.alerts?.filter(a => a.status === 'ACTIVE') || [];

  return (
    <div className="space-y-6 font-mono">
      <div className="glass-panel p-5 lg:px-8 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-400" />
            Cloud Network Topology & Attack Vector Map
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visualization of targeted Cloud VPC Subnets, EC2 Instances, and active attack pathways.
          </p>
        </div>
        <span className="badge badge-low">TOPOLOGY ACTIVE</span>
      </div>

      <div className="glass-panel p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3 text-slate-200 text-sm font-bold border-b border-slate-800 pb-3">
          <Cloud className="w-6 h-6 text-blue-400" />
          <span>AWS Cloud Infrastructure Overview</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-blue-400 flex items-center gap-2">
              <Shield className="w-4 h-4" /> VPC-1: US-East Production VPC (10.0.0.0/16)
            </span>
            <span className="text-slate-500">Region: us-east-1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Public Web Subnet (10.0.1.0/24)</span>
                <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Shield Firewall Active
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <div>
                      <p className="text-slate-200 font-bold">Web-Server-01 (10.0.1.15)</p>
                      <p className="text-[10px] text-slate-500">Port 80/443 | Apache/HTTPS</p>
                    </div>
                  </div>
                  {activeThreats.some(a => a.threat_type === 'DoS_DDoS') ? (
                    <span className="badge badge-critical text-[10px]">UNDER DOS ATTACK</span>
                  ) : (
                    <span className="text-emerald-400 text-[10px]">NORMAL</span>
                  )}
                </div>

                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-slate-200 font-bold">Auth-Server-02 (10.0.1.28)</p>
                      <p className="text-[10px] text-slate-500">Port 22 | OpenSSH</p>
                    </div>
                  </div>
                  {activeThreats.some(a => a.threat_type === 'Brute_Force') ? (
                    <span className="badge badge-high text-[10px]">BRUTE FORCE TARGET</span>
                  ) : (
                    <span className="text-emerald-400 text-[10px]">NORMAL</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">Private Database Subnet (10.0.2.0/24)</span>
                <span className="text-purple-400 text-[10px]">Isolated VPC Subnet</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-slate-200 font-bold">DB-Cluster-01 (10.0.2.55)</p>
                      <p className="text-[10px] text-slate-500">PostgreSQL | Private Access</p>
                    </div>
                  </div>
                  {activeThreats.some(a => a.threat_type === 'IAM_Privilege_Escalation') ? (
                    <span className="badge badge-critical text-[10px]">IAM ESCALATION DETECTED</span>
                  ) : (
                    <span className="text-emerald-400 text-[10px]">SECURE</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
