import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Server, CheckCircle2, AlertOctagon, Mail, Building, Plus } from 'lucide-react';
import { fetchEmployees, addEmployee, assignResourceToEmployee, toggleEmployeeStatus, fetchEmployeeIncidents } from '../services/api';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Employee Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newDepartment, setNewDepartment] = useState('DevOps Engineering');
  const [newRole, setNewRole] = useState('EMPLOYEE');

  // Assign Resource Form State
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [resName, setResName] = useState('App-Server-03');
  const [resIp, setResIp] = useState('10.0.1.45');
  const [resSubnet, setResSubnet] = useState('Public Web Subnet (10.0.1.0/24)');

  const loadData = async () => {
    setLoading(true);
    try {
      const empData = await fetchEmployees();
      setEmployees(empData.employees || []);

      const incData = await fetchEmployeeIncidents();
      setIncidents(incData.incidents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee({
        email: newEmail,
        full_name: newName,
        department: newDepartment,
        role: newRole,
        password: "Employee@123"
      });
      setShowAddModal(false);
      setNewEmail('');
      setNewName('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAssignResourceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmp) return;
    try {
      await assignResourceToEmployee(selectedEmp.id, {
        resource_id: `VM-${Math.floor(Math.random()*900+100)}`,
        resource_name: resName,
        ip_address: resIp,
        subnet: resSubnet
      });
      setSelectedEmp(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await toggleEmployeeStatus(userId, nextStatus);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header Banner */}
      <div className="glass-panel p-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            Enterprise Organization Employee Governance & RBAC
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization employees, assign cloud VM instances/subnets, control access statuses, and triage employee anomaly reports.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary text-xs py-2.5 px-4 font-bold"
        >
          <UserPlus className="w-4 h-4" /> Onboard Employee
        </button>
      </div>

      {/* Employee Roster Table */}
      <div className="glass-panel p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-200">Organization Employee Roster</h4>
          <span className="text-xs text-slate-400">Total Accounts: <strong className="text-slate-100">{employees.length}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Employee Name & Email</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4">Assigned Cloud Instances</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-100">{emp.full_name}</p>
                    <p className="text-slate-400 text-[11px]">{emp.email}</p>
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{emp.department}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      emp.role === 'ORG_ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {emp.assigned_resources && emp.assigned_resources.length > 0 ? (
                      <div className="space-y-1">
                        {emp.assigned_resources.map((res, i) => (
                          <div key={i} className="text-[11px] text-blue-300 flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                            <Server className="w-3 h-3 text-blue-400" />
                            <span>{res.resource_name} ({res.ip_address})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">No resources assigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      emp.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEmp(emp)}
                        className="btn btn-secondary text-[11px] py-1 px-2.5"
                      >
                        <Plus className="w-3 h-3" /> Assign Instance
                      </button>
                      {emp.role !== 'ORG_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(emp.id, emp.status)}
                          className={`btn text-[11px] py-1 px-2.5 ${
                            emp.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'
                          }`}
                        >
                          {emp.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Reported Incidents Section */}
      <div className="glass-panel p-6 lg:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            Employee Submitted Anomaly Reports
          </h4>
          <span className="text-xs text-slate-400">Total Reports: {incidents.length}</span>
        </div>

        <div className="space-y-3">
          {incidents.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No employee anomaly reports filed yet.</p>
          ) : (
            incidents.map((inc) => (
              <div key={inc.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 text-sm">{inc.title}</span>
                    <span className="badge badge-high text-[10px]">{inc.severity} SEVERITY</span>
                  </div>
                  <p className="text-xs text-slate-300">{inc.description}</p>
                  <p className="text-[11px] text-slate-500">Filed by: {inc.user_name} ({inc.user_email}) on {inc.created_at}</p>
                </div>

                <span className="px-3 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                  Status: {inc.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Onboard Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 max-w-md w-full space-y-4">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Onboard New Organization Employee
            </h4>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text" required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. David Miller"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Corporate Email</label>
                <input
                  type="email" required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. david@cloudguard.io"
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Department</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                >
                  <option value="DevOps Engineering">DevOps Engineering</option>
                  <option value="IAM & Authentication">IAM & Authentication</option>
                  <option value="Data Infrastructure">Data Infrastructure</option>
                  <option value="Cyber Security Operations">Cyber Security Operations</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                >
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ORG_ADMIN">ORG_ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Resource Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 max-w-md w-full space-y-4">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Server className="w-5 h-5 text-blue-400" />
              Assign Instance to {selectedEmp.full_name}
            </h4>

            <form onSubmit={handleAssignResourceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Resource / VM Name</label>
                <input
                  type="text" required
                  value={resName}
                  onChange={(e) => setResName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">IP Address</label>
                <input
                  type="text" required
                  value={resIp}
                  onChange={(e) => setResIp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subnet</label>
                <input
                  type="text" required
                  value={resSubnet}
                  onChange={(e) => setResSubnet(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedEmp(null)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs"
                >
                  Confirm Resource Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
