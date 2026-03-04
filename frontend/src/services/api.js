const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Helper function for fetch requests
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// ===== AUTH SERVICES =====
export const authAPI = {
  login: (email, password) => 
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (userData) => 
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
};

// ===== USER SERVICES =====
export const userAPI = {
  getProfile: () => fetchAPI('/users/profile'),
  updateProfile: (data) => 
    fetchAPI('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  getSettings: () => fetchAPI('/users/settings'),
  updateSettings: (data) => 
    fetchAPI('/users/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};

// ===== DASHBOARD SERVICES =====
export const dashboardAPI = {
  getStats: () => fetchAPI('/dashboard/stats'),
  getProgress: () => fetchAPI('/dashboard/progress'),
  getStreaks: () => fetchAPI('/dashboard/streaks')
};

// ===== STUDY TOOLS SERVICES =====
export const studyAPI = {
  // Goals
  getGoals: () => fetchAPI('/study/goals'),
  addGoal: (goal) => 
    fetchAPI('/study/goals', {
      method: 'POST',
      body: JSON.stringify(goal)
    }),
  updateGoal: (id, goal) => 
    fetchAPI(`/study/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal)
    }),
  deleteGoal: (id) => 
    fetchAPI(`/study/goals/${id}`, {
      method: 'DELETE'
    }),

  // Study Sessions
  saveSession: (session) => 
    fetchAPI('/study/sessions', {
      method: 'POST',
      body: JSON.stringify(session)
    }),
  getSessions: () => fetchAPI('/study/sessions'),

  // Focus Time
  saveFocusTime: (minutes) => 
    fetchAPI('/study/focus', {
      method: 'POST',
      body: JSON.stringify({ minutes })
    }),

  // Analytics
  getAnalytics: () => fetchAPI('/study/analytics')
};

// ===== CHAT SERVICES (Your existing one) =====
export const sendChatMessage = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response');
    }

    return data.response;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw error;
  }
};

// Default export for convenience
const api = {
  auth: authAPI,
  user: userAPI,
  dashboard: dashboardAPI,
  study: studyAPI,
  chat: sendChatMessage
};

export default api;