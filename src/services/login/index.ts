import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseURL } from '../baseUrl';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/login', credentials);

      this.setToken(response.data.token);
      if (response.data.refreshToken) {
        this.setRefreshToken(response.data.refreshToken);
      }
console.log('response', response.data)
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);

      this.setToken(response.data.token);
      if (response.data.refreshToken) {
        this.setRefreshToken(response.data.refreshToken);
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.response?.data?.message || 'Erro ao registrar usuário');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await api.post('/auth/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      this.removeToken();
      this.removeRefreshToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await api.get<User>('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      this.removeToken();
      this.removeRefreshToken();
      return null;
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await api.post<{ token: string }>('/auth/refresh', { refreshToken });

      this.setToken(response.data.token);
      return response.data.token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.removeToken();
      this.removeRefreshToken();
      return null;
    }
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async authenticatedRequest<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    let token = this.getToken();

    try {
      const response = await api.request<T>({
        url,
        ...config,
        headers: {
          ...config.headers,
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      return response;
    } catch (error: any) {
      if (error.response?.status === 401 && token) {
        const newToken = await this.refreshToken();
        if (newToken) {
          return api.request<T>({
            url,
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }

      throw error;
    }
  }
}

export const authService = new AuthService();
