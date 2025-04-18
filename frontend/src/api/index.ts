import axios from 'axios';
import { API_BASE_URL } from '@/api/api-config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
