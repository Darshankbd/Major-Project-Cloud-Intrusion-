const API_BASE = '/api';

export const api = {
  // Health
  getHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Datasets
  getDatasets: async () => {
    const res = await fetch(`${API_BASE}/datasets`);
    return res.json();
  },

  uploadDataset: async (formData) => {
    const res = await fetch(`${API_BASE}/datasets/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // ML Training & Models
  trainModels: async (dataset, algorithms) => {
    const res = await fetch(`${API_BASE}/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset, algorithms })
    });
    return res.json();
  },

  getTrainingCurves: async (dataset = 'nsl-kdd') => {
    const res = await fetch(`${API_BASE}/models/curves?dataset=${dataset}`);
    return res.json();
  },

  getConfusionMatrix: async (dataset = 'nsl-kdd') => {
    const res = await fetch(`${API_BASE}/models/confusion-matrix?dataset=${dataset}`);
    return res.json();
  },

  getModelDownloadUrl: (dataset, algo) => {
    return `${API_BASE}/models/download/${dataset}/${encodeURIComponent(algo)}`;
  },

  // Telemetry & Exploit Sandbox
  getLiveTelemetryPacket: async () => {
    const res = await fetch(`${API_BASE}/telemetry/packet`);
    return res.json();
  },

  predictVector: async (dataset, packet) => {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataset, packet })
    });
    return res.json();
  },

  simulateExploit: async (payload) => {
    const res = await fetch(`${API_BASE}/sandbox/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Dashboard & Alerts
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return res.json();
  },

  getAlerts: async () => {
    const res = await fetch(`${API_BASE}/alerts`);
    return res.json();
  },

  mitigateAlert: async (alertId) => {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/mitigate`, {
      method: 'POST'
    });
    return res.json();
  },

  // History Log
  getHistory: async (page = 1, limit = 15, search = '', severity = '', attackType = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      search,
      severity,
      attack_type: attackType
    });
    const res = await fetch(`${API_BASE}/history?${params.toString()}`);
    return res.json();
  },

  // Reports
  getPdfReportUrl: () => `${API_BASE}/reports/pdf`,
  getCsvReportUrl: () => `${API_BASE}/reports/csv`,

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  saveSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  }
};
