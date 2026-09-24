const getApiBase = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' && window.location.port === '3000') {
      return 'http://localhost:5000/api';
    }
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

export const getActiveGymId = () => {
  try {
    const raw = localStorage.getItem('gym_app_user') || localStorage.getItem('gym_owner_user');
    if (!raw) return '';
    const user = JSON.parse(raw);
    return user?.gymId || user?.id || '';
  } catch (e) {
    return '';
  }
};

async function request(endpoint, options = {}) {
  try {
    const gymId = getActiveGymId();
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(gymId ? { 'x-gym-id': gymId } : {}),
        ...(options.headers || {})
      },
      ...options
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn(`[API Warning] Request to ${endpoint} failed:`, error.message);
    return { success: false, message: error.message };
  }
}

export const authAPI = {
  login: (emailOrMobile, password, role) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrMobile, password, role })
    }),
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),
  changePassword: (passwordData) =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    }),
  googleLogin: (googleData) =>
    request('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googleData)
    }),
  forgotPassword: (email, role) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    }),
  resetPassword: (resetData) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData)
    })
};

export const dashboardAPI = {
  getStats: () => request('/dashboard/stats')
};

export const membersAPI = {
  getAll: (search = '', status = 'All') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    return request(`/members?${params.toString()}`);
  },
  create: (data) => {
    const gymId = getActiveGymId();
    return request('/members', {
      method: 'POST',
      body: JSON.stringify({ ...data, gymId: data.gymId || gymId })
    });
  },
  update: (id, data) =>
    request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  updateProfile: (id, data) =>
    request(`/members/${id}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  changePassword: (id, passwordData) =>
    request(`/members/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    }),
  delete: (id) =>
    request(`/members/${id}`, {
      method: 'DELETE'
    }),
  renew: (id, data) =>
    request(`/members/${id}/renew`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};

export const membershipsAPI = {
  getAll: () => request('/memberships'),
  create: (data) => {
    const gymId = getActiveGymId();
    return request('/memberships', {
      method: 'POST',
      body: JSON.stringify({ ...data, gymId: data.gymId || gymId })
    });
  }
};

export const attendanceAPI = {
  getToday: () => request('/attendance/today'),
  checkIn: (memberId) =>
    request('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify({ memberId })
    }),
  checkOut: (attendanceId) =>
    request('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify({ attendanceId })
    }),
  getHistory: (date = '', search = '') => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (search) params.append('search', search);
    return request(`/attendance/history?${params.toString()}`);
  },
  delete: (id) =>
    request(`/attendance/${id}`, {
      method: 'DELETE'
    })
};

export const trainersAPI = {
  getAll: () => request('/trainers'),
  create: (data) => request('/trainers', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/trainers/${id}`, { method: 'DELETE' }),
  updateProfile: (id, data) => request(`/trainers/${id}/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (id, data) => request(`/trainers/${id}/password`, { method: 'PUT', body: JSON.stringify(data) })
};
