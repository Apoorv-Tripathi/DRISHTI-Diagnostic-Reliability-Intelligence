// Real Connected API Client for PROJECT D.R.I.S.H.T.I.
// Strict backend communication with JWT Authentication & MongoDB Atlas persistence

let rawApiBase = import.meta.env.VITE_API_BASE_URL || '/api';
rawApiBase = rawApiBase.trim().replace(/\/+$/, '');
// Auto-append /api if user supplied base URL without /api path
if (rawApiBase.startsWith('http') && !rawApiBase.endsWith('/api')) {
  rawApiBase += '/api';
}
const API_BASE = rawApiBase;

// Helper to get stored JWT token
export const getAuthToken = () => {
  return localStorage.getItem('drishti_jwt_token');
};

// Helper to get stored user profile
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('drishti_current_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

// Headers with JWT authorization Bearer token
const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==============================================================================
// 1. AUTHENTICATION & SESSION MANAGEMENT (JWT)
// ==============================================================================

export const login = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Authentication failed. Please verify your credentials.');
    }

    // Persist JWT token and user profile
    localStorage.setItem('drishti_jwt_token', data.token);
    localStorage.setItem('drishti_current_user', JSON.stringify(data.user));

    return { token: data.token, user: data.user };
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Connection refused: Backend server is unreachable. If deployed on Render, please allow ~45s for the free instance to spin up.');
    }
    throw err;
  }
};

export const getCurrentUser = async () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('drishti_current_user', JSON.stringify(data.user));
        return data.user;
      }
    }

    // If token expired or invalid (401), clear auth
    if (res.status === 401) {
      logout();
    }
    return null;
  } catch (err) {
    console.warn('Backend unavailable during session check:', err.message);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('drishti_jwt_token');
  localStorage.removeItem('drishti_current_user');
};

export const fetchUsers = async () => {
  const res = await fetch(`${API_BASE}/auth/users`);
  if (!res.ok) {
    throw new Error(`Failed to fetch user roster: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
};

// ==============================================================================
// 2. AIRCRAFT FLEET DATA
// ==============================================================================

export const fetchAircraft = async () => {
  const res = await fetch(`${API_BASE}/aircraft`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to load aircraft fleet from database: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
};

export const fetchAircraftById = async (id) => {
  const res = await fetch(`${API_BASE}/aircraft/${id}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to load airframe ${id}: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

// ==============================================================================
// 3. PREDICTIVE ALERTS & ANOMALIES
// ==============================================================================

export const fetchAlerts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/alerts${query ? '?' + query : ''}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to load alerts: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
};

// ==============================================================================
// 4. DEPOT SPARES INVENTORY & REQUISITION
// ==============================================================================

export const fetchSpares = async () => {
  const res = await fetch(`${API_BASE}/spares`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to load depot spares: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
};

export const requisitionSparePart = async (partNumber, data) => {
  const res = await fetch(`${API_BASE}/spares/${partNumber}/requisition`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error(`Failed to requisition spare part: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

// ==============================================================================
// 5. MAINTENANCE WORK ORDERS & TECHNICIAN ASSIGNMENTS
// ==============================================================================

export const fetchWorkOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/maintenance${query ? '?' + query : ''}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to load work orders: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data || [];
};

export const createNewWorkOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/maintenance`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });
  if (!res.ok) {
    throw new Error(`Failed to create work order: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

export const startMaintenanceOrder = async (orderId, jobData = {}) => {
  const res = await fetch(`${API_BASE}/maintenance/${orderId}/start`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData)
  });
  if (!res.ok) {
    throw new Error(`Failed to update order status to in-progress: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

export const completeMaintenanceOrder = async (orderId, completionData) => {
  const res = await fetch(`${API_BASE}/maintenance/${orderId}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(completionData)
  });
  if (!res.ok) {
    throw new Error(`Failed to sign-off maintenance release: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

export const validateMaintenanceOrder = async (orderId, validationData) => {
  const res = await fetch(`${API_BASE}/maintenance/${orderId}/validate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(validationData)
  });
  if (!res.ok) {
    throw new Error(`Failed to validate and issue passing order: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

// ==============================================================================
// 6. TELEMETRY STREAMS & ANALYTICS
// ==============================================================================

export const fetchTelemetry = async (aircraftId) => {
  const res = await fetch(`${API_BASE}/telemetry/${aircraftId}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch live telemetry: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

export const fetchAnalytics = async () => {
  const res = await fetch(`${API_BASE}/analytics`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch fleet analytics: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};
