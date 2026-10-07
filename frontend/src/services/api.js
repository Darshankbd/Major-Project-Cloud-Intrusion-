const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = isLocal ? "http://127.0.0.1:8000/api" : `${window.location.origin}/api`;
export const WS_BASE_URL = isLocal 
  ? "ws://127.0.0.1:8000/ws/live-stream" 
  : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/live-stream`;

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Authentication failed");
  }
  return res.json();
}

export async function fetchEmployees() {
  const res = await fetch(`${API_BASE_URL}/org/employees`);
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}

export async function addEmployee(employeeData) {
  const res = await fetch(`${API_BASE_URL}/org/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employeeData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add employee");
  }
  return res.json();
}

export async function assignResourceToEmployee(userId, resourceData) {
  const res = await fetch(`${API_BASE_URL}/org/employees/${userId}/assign-resource`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resourceData)
  });
  return res.json();
}

export async function toggleEmployeeStatus(userId, status) {
  const res = await fetch(`${API_BASE_URL}/org/employees/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return res.json();
}

export async function submitIncidentReport(incidentData) {
  const res = await fetch(`${API_BASE_URL}/employee/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incidentData)
  });
  return res.json();
}

export async function fetchEmployeeIncidents() {
  const res = await fetch(`${API_BASE_URL}/employee/incidents`);
  return res.json();
}

export async function fetchOrgSettings() {
  const res = await fetch(`${API_BASE_URL}/org/settings`);
  return res.json();
}

export async function saveOrgSettings(settingsData) {
  const res = await fetch(`${API_BASE_URL}/org/settings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settingsData)
  });
  return res.json();
}

export async function fetchNotificationLogs() {
  const res = await fetch(`${API_BASE_URL}/notifications/logs`);
  return res.json();
}

export async function fetchPredictFlow(flowData) {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flowData)
  });
  if (!res.ok) throw new Error("Prediction API error");
  return res.json();
}

export async function fetchTrafficStatus() {
  const res = await fetch(`${API_BASE_URL}/traffic/status`);
  if (!res.ok) throw new Error("Traffic status error");
  return res.json();
}

export async function startTrafficSimulator() {
  const res = await fetch(`${API_BASE_URL}/traffic/start`, { method: "POST" });
  return res.json();
}

export async function stopTrafficSimulator() {
  const res = await fetch(`${API_BASE_URL}/traffic/stop`, { method: "POST" });
  return res.json();
}

export async function injectAttack(attackType, count = 5) {
  const res = await fetch(`${API_BASE_URL}/traffic/inject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attack_type: attackType, count })
  });
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${API_BASE_URL}/alerts`);
  if (!res.ok) throw new Error("Alerts API error");
  return res.json();
}

export async function mitigateAlert(alertId, action = "Block Source IP") {
  const res = await fetch(`${API_BASE_URL}/alerts/${alertId}/mitigate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, admin_user: "SOC_Operator" })
  });
  return res.json();
}

export async function fetchMLMetrics() {
  const res = await fetch(`${API_BASE_URL}/metrics`);
  if (!res.ok) throw new Error("Metrics API error");
  return res.json();
}

export async function triggerRetrain() {
  const res = await fetch(`${API_BASE_URL}/retrain`, { method: "POST" });
  return res.json();
}

export function getReportDownloadUrl() {
  return `${API_BASE_URL}/reports/pdf`;
}

export function createWebSocketStream(onMessage, onError) {
  let ws = new WebSocket(WS_BASE_URL);

  ws.onopen = () => {
    console.log("WebSocket connected to CloudGuard Live Stream.");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.error("WS Parse error", e);
    }
  };

  ws.onerror = (err) => {
    console.error("WS Error", err);
    if (onError) onError(err);
  };

  ws.onclose = () => {
    setTimeout(() => {
      createWebSocketStream(onMessage, onError);
    }, 3000);
  };

  return ws;
}
