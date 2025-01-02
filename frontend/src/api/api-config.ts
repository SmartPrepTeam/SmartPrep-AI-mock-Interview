import { profile } from 'console';

export const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/signup`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  resume: {
    upload: `${API_BASE_URL}/resume/upload`,
  },
  user: {
    profile: `${API_BASE_URL}/user/profile`,
  },
  textual_interview: {
    question_generation: `${API_BASE_URL}/textual_interviews/questions`,
    score_generation: `${API_BASE_URL}/textual_interviews/questions`,
    feedback: `${API_BASE_URL}/textual_interviews/feedback`,
  },
};
