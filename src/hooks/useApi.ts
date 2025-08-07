// hooks/useAuthGuard.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para proteger rotas que requerem autenticação
 */
export const useAuthGuard = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};

// hooks/useGuestGuard.ts
/**
 * Hook para redirecionar usuários autenticados (ex: tela de login)
 */
export const useGuestGuard = (redirectTo: string = '/') => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};

// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { message } from 'antd';
import { useAuth } from '../context/AuthContext';
import type { ApiResponse } from '../utils/apiClient';

interface UseApiOptions {
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

/**
 * Hook para facilitar chamadas de API com loading e tratamento de erro
 */
export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    showSuccessMessage = false,
    showErrorMessage = true,
    successMessage = 'Operação realizada com sucesso!',
    errorMessage = 'Ocorreu um erro na operação.',
  } = options;

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiCall();
        setData(response.data);

        if (showSuccessMessage) {
          message.success(response.message || successMessage);
        }

        return response.data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : errorMessage;
        setError(errorMsg);

        if (showErrorMessage) {
          message.error(errorMsg);
        }

        return null;
      } finally {
        setLoading(false);
      }
    },
    [showSuccessMessage, showErrorMessage, successMessage, errorMessage]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    data,
    error,
    execute,
    reset,
  };
};

// hooks/usePermissions.ts
/**
 * Hook para verificar permissões do usuário
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;

      // Implementar lógica de permissões baseada no seu backend
      // Exemplo: verificar se user.permissions inclui a permissão
      // return user.permissions?.includes(permission) || false;

      // Por enquanto, retorna true para usuários autenticados
      return true;
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      if (!user) return false;

      // Implementar lógica de roles baseada no seu backend
      // Exemplo: return user.role === role;

      // Por enquanto, retorna true para usuários autenticados
      return true;
    },
    [user]
  );

  const isAdmin = useCallback((): boolean => {
    return hasRole('admin');
  }, [hasRole]);

  const isOwner = useCallback((): boolean => {
    return hasRole('owner');
  }, [hasRole]);

  return {
    hasPermission,
    hasRole,
    isAdmin,
    isOwner,
  };
};

// hooks/useLocalStorage.ts

/**
 * Hook para gerenciar estado com localStorage
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // Função para obter valor inicial
  const getInitialValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  // Função para atualizar valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  };

  // Escutar mudanças em outras abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erro ao sincronizar localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};
