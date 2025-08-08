import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { message } from 'antd';
import type { UserInterface } from '../interfaces/UserInterface';
import { sistemaName } from '../config/sistemaConfig';
import { urlsServices } from '../config/urlsConfig';
import { useAxiosToken } from '../hooks/useApi';

export type AuthContextType = {
  user: UserInterface | null;
  validado: boolean;
  isLoading: boolean;
  setUserSSO: (us: UserInterface | null) => void;
  logoutSSO: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// Função utilitária para extrair parâmetro da URL
const getParameterUrl = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Classe utilitária para preparar dados do usuário
class AuthUtils {
  static prepareDataUser(data: any): UserInterface {
    return {
      token: data.access_token,
      usuarioId: data.usuario.usuarioId,
      username: data.usuario.username,
      pessoa: {
        pessoaId: data.usuario.pessoa.pessoaId,
        cpf: data.usuario.pessoa.cpf,
        nome: data.usuario.pessoa.nome,
        sobrenome: data.usuario.pessoa.sobrenome,
        dataNascimento: data.usuario.pessoa.dataNascimento,
        sexo: data.usuario.pessoa.sexo,
      },
      funcionarios: data.usuario.funcionarios,
      clientes: data.usuario.clientes,
      administradores: data.usuario.administradores,
    };
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const apiAxios = useAxiosToken();
  const [user, setUser] = useState<UserInterface | null>(null);
  const [validado, setValidado] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const validaToken = async (token: string) => {
    try {
      setIsLoading(true);
      const res = await apiAxios.validaToken(token);
      const userValidation = AuthUtils.prepareDataUser(res.data);

      localStorage.setItem('token_sso', token);
      setUser(userValidation);
      setValidado(true);
    } catch (err) {
      console.error('Erro ao validar token:', err);
      setUser(null);
      setValidado(false);
      localStorage.removeItem('token_sso');

      message.error({
        content: 'Erro ao tentar validar seu token! Você será redirecionado.',
        duration: 5,
      });

      // Aguarda a mensagem ser exibida antes de redirecionar
      setTimeout(() => {
        redirectToAuth();
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToAuth = () => {
    const currentUrl = window.location.href
      .replace('#', '|')
      .split('/?access_token')[0];

    window.location.href = `${urlsServices.FRONTEND}auth?response_type=token_only&client_id=${sistemaName}&redirect_uri=${encodeURIComponent(currentUrl)}`;
  };

  const setUserSSO = (us: UserInterface | null) => {
    setUser(us);
    if (us) {
      setValidado(true);
    }
  };

  const logoutSSO = async (): Promise<void> => {
    try {
      await apiAxios.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
      setValidado(false);
      localStorage.removeItem('token_sso');
      redirectToAuth();
    }
  };

  // useEffect para gerenciar a autenticação inicial
  useEffect(() => {
    const initializeAuth = async () => {
      const tokenStorage = localStorage.getItem('token_sso');
      const tokenParam = getParameterUrl('access_token');

      if (tokenStorage && tokenStorage.trim() !== '') {
        // Se já tem um usuário válido com o mesmo token, não revalida
        if (user?.token === tokenStorage) {
          setIsLoading(false);
          return;
        }
        await validaToken(tokenStorage);
      } else if (tokenParam) {
        await validaToken(tokenParam);
        // Remove o token da URL após processar
        const url = new URL(window.location.href);
        url.searchParams.delete('access_token');
        window.history.replaceState({}, document.title, url.toString());
      } else {
        setIsLoading(false);
        redirectToAuth();
      }
    };

    initializeAuth();
  }, []); // Executa apenas uma vez na montagem do componente

  return (
    <AuthContext.Provider
      value={{
        user,
        validado,
        isLoading,
        setUserSSO,
        logoutSSO,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
