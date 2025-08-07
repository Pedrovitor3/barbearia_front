// contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, type ReactNode,  } from 'react';
import { message } from 'antd';
import { authService, type LoginCredentials, type RegisterCredentials, type User } from '../services/login';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticação ao inicializar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const user = await authService.getCurrentUser();
      if (user) {
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authService.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });

      message.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });

      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      message.error(errorMessage);
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authService.register(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });

      message.success('Registro realizado com sucesso!');
      return true;
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });

      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar usuário';
      message.error(errorMessage);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      message.success('Logout realizado com sucesso!');
    } catch (error) {
      // Mesmo com erro, fazer logout local
      dispatch({ type: 'LOGOUT' });
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
