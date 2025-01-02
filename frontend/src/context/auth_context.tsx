import {
  ReactNode,
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { api } from '@/api';
import { ENDPOINTS } from '@/api/api-config';

type AuthContextType = {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  setToken: (token: string | null) => void;
  token: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface TokenResponse {
  access_token: string;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const access_token = sessionStorage.getItem('access_token');
  const user_id = sessionStorage.getItem('user_id');
  const [userId, setUserId] = useState<string | null>(user_id);
  const [token, setToken] = useState<string | null>(access_token);
  useEffect(() => {
    if (token) sessionStorage.setItem('access_token', token);
    else sessionStorage.removeItem('access_token');
  }, [token]);
  useEffect(() => {
    if (userId) sessionStorage.setItem('user_id', userId);
    else sessionStorage.removeItem('user_id');
  }, [userId]);
  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const res = await api.post(ENDPOINTS.auth.refresh);
            const newToken = res.data.access_token;

            setToken(newToken);

            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            return api(originalRequest);
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            setToken(null);
            setUserId(null);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [setToken, setUserId]);
  return (
    <AuthContext.Provider value={{ userId, setUserId, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
