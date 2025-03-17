export const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const ENDPOINTS = {
  auth: {
    login: `/auth/login`,
    signup: `/auth/signup`,
    refresh: `/auth/refresh`,
    logout: `/auth/logout`,
  },
  resume: {
    upload: `/resume/upload`,
  },
  user: {
    profile: `/user/profile`,
  },
  textual_interview: {
    question_generation: `/textual_interviews/questions`,
    score_generation: `/textual_interviews/questions`,
    feedback: `/textual_interviews/feedback`,
  },
  video_interview: {
    score_generation: `/video_interviews/questions`,
    incomplete_interview: `/video_interviews/incomplete`,
  },
  frames: {
    question: `/frames/question`,
  },
};
