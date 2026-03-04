// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USER: {
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    PROGRESS: '/dashboard/progress',
    STREAKS: '/dashboard/streaks',
  },
  STUDY: {
    GOALS: '/study/goals',
    SESSIONS: '/study/sessions',
    FOCUS: '/study/focus',
    ANALYTICS: '/study/analytics',
  },
};

// Exam Types
export const EXAM_TYPES = {
  JEE: 'JEE',
  NEET: 'NEET',
};

// Grades
export const GRADES = {
  CLASS_11: 'Class 11',
  CLASS_12: 'Class 12',
  DROPPER: 'Dropper',
};

// Subjects
export const SUBJECTS = {
  JEE: ['physics', 'chemistry', 'mathematics'],
  NEET: ['physics', 'chemistry', 'biology'],
};

// Languages
export const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'marathi', label: 'Marathi' },
];

// Timer Settings
export const TIMER_DEFAULTS = {
  POMODORO: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  TOKEN: 'token',
  USER: 'user',
  GOALS: 'studyGoals',
  FOCUS_TIME: 'totalFocusTime',
  FOCUS_STREAK: 'focusStreak',
};