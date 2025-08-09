// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { message } from 'antd';
import { LoginService } from '../services/loginService';

interface Pessoa {
  pessoaId: number;
  cpf: string;
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  sexo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Empresa {
  empresaId: number;
  nomeFantasia: string;
  slug: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string | null;
  email: string | null;
  website: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Funcionario {
  funcionarioId: number;
  pessoaId: number;
  empresaId: number;
  cargo: string;
  salario: number | null;
  dataAdmissao: string;
  dataDemissao: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  empresa: Empresa;
}

interface Cliente {
  clienteId: number;
  pessoaId: number;
  empresaId: number;
  // adicione outros campos conforme necessário
}

interface Administrador {
  administradorId: number;
  pessoaId: number;
  // adicione outros campos conforme necessário
}

interface Usuario {
  usuarioId: number;
  pessoaId: number;
  username: string;
  senhaHash: string;
  ultimoLogin: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  pessoa: Pessoa;
  clientes: Cliente[];
  funcionarios: Funcionario[];
  administradores: Administrador[];
}

interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<Usuario>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se existe token salvo ao inicializar
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);

        // Verificar se o token ainda é válido (opcional)
        validateToken(savedToken).then(isValid => {
          if (!isValid) {
            logout();
          }
        });
      } catch (error) {
        console.error('Erro ao recuperar dados de autenticação:', error);
        logout();
      }
    }

    setIsLoading(false);
  }, []);

  // Função para validar token (opcional - implementar conforme sua API)
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      // Fazer uma requisição para validar o token
      // Implementar conforme sua API
      const response = await fetch('/api/validate-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simular chamada da API - substitua pela sua implementação real
      const response = await LoginService(username, password)

      if (!response) {
        throw new Error('Credenciais inválidas');
      }

      const data: LoginResponse = response.data;

      // Salvar no localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('auth_user', JSON.stringify(data.usuario));

      // Atualizar estado
      setToken(data.access_token);
      setUser(data.usuario);

      message.success('Login realizado com sucesso!');
      return true;

    } catch (error: any) {
      message.error(error.message || 'Erro ao fazer login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Limpar estado
    setToken(null);
    setUser(null);

    message.success('Logout realizado com sucesso!');

    // Redirecionar para login (opcional)
    window.location.href = '/login';
  };

  const updateUser = (userData: Partial<Usuario>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// HOC para proteger rotas
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Carregando...</div>; // ou um componente de loading
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    return <Component {...props} />;
  };
};
