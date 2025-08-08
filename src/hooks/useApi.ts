import axios from 'axios';
import { urlsServices } from '../config/urlsConfig';

const api = axios.create({
  baseURL: urlsServices.BACKENDWS,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token_sso');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token_sso');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const useAxiosToken = () => ({
  validaToken: async (token: string) => {
    const response = await api.get(`/validate`, {
      params: { token },
    });
    return response;
  },

  logout: async () => {
    const token = localStorage.getItem('token_sso');
    const response = await api.get(`/logout`, {
      params: { token },
    });
    return response;
  },

  // Método para fazer requisições autenticadas genéricas
  authenticatedRequest: async (config: any) => {
    return await api(config);
  },
});
