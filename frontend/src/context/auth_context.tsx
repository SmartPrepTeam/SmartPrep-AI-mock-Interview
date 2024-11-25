import { ReactNode, createContext, useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { api } from '@/api/index';
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
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useLayoutEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        // Handle request error
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an unauthorized request
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.post<TokenResponse>(
              ENDPOINTS.auth.refresh
            );
            const newAccessToken = response.data.access_token;
            setToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axios(originalRequest);
          } catch (tokenRefreshError) {
            setToken(null);
            setUserId(null);
            console.error('Token refresh failed', tokenRefreshError);
            return Promise.reject(tokenRefreshError);
          }
        }

        // Handle other errors
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
