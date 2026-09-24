export const getApiBase = () => {
  // 1. Explicit React build environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    // 2. Allow runtime query parameter or localStorage override (?api=https://... or localStorage.getItem('gym_api_url'))
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryApi = urlParams.get('api');
      if (queryApi) {
        localStorage.setItem('gym_api_url', queryApi);
      }
    } catch (e) {
      // Ignore URLSearchParams error in rare environments
    }

    const customApi =
      window.__API_URL__ ||
      localStorage.getItem('gym_api_url') ||
      localStorage.getItem('REACT_APP_API_URL');
    if (customApi) {
      return customApi.replace(/\/+$/, '');
    }

    // 3. React dev server on localhost:3000 -> target backend on 5000
    if (window.location.hostname === 'localhost' && window.location.port === '3000') {
      return 'http://localhost:5000/api';
    }

    // 4. Default relative /api (unified full-stack deployment)
    return '/api';
  }

  return 'http://localhost:5000/api';
};

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
    const apiBase = getApiBase();
    const gymId = getActiveGymId();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${apiBase}${cleanEndpoint}`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(gymId ? { 'x-gym-id': gymId } : {}),
        ...(options.headers || {})
      },
      ...options
    });

    const contentType = res.headers.get('content-type') || '';
    const rawText = await res.text();

    // Handle valid JSON response
    if (contentType.includes('application/json')) {
      try {
        const data = JSON.parse(rawText);
        return data;
      } catch (err) {
        console.warn(`[API Warning] Malformed JSON received from ${url}:`, err);
        return {
          success: false,
          message: 'Server returned an invalid JSON response.'
        };
      }
    }

    // Handle HTML or unexpected response formats (e.g. Render 502/503 cold starts or static 404s)
    console.warn(`[API Warning] Expected JSON but received ${contentType} (Status ${res.status}) from ${url}:`, rawText.slice(0, 150));

    if (res.status === 502 || res.status === 503) {
      return {
        success: false,
        message: 'Render server is waking up from standby (free tier cold start). Please wait 15-20 seconds and try again.'
      };
    }

    if (res.status === 404) {
      return {
        success: false,
        message: `Backend API endpoint not found (${cleanEndpoint}). Please verify backend server URL.`
      };
    }

    if (rawText.includes('<!DOCTYPE') || rawText.includes('<html')) {
      return {
        success: false,
        message: 'Cannot connect to backend API server. The backend might be starting up or the API URL is pointing to a static web page.'
      };
    }

    return {
      success: false,
      message: rawText || `Server request failed with status ${res.status}`
    };
  } catch (error) {
    console.warn(`[API Warning] Request to ${endpoint} failed:`, error.message);
    return {
      success: false,
      message: error.message || 'Network connection error. Please check your internet and server status.'
    };
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
  forgotPassword: (email, role, targetEmail) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, role, targetEmail })
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
