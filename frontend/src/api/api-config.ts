export const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/signup`,
    refresh: `${API_BASE_URL}/auth/refresh`,
  },
};
