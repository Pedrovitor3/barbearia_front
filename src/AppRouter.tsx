// AppRouter.tsx - Versão atualizada com temas customizados
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Typography,
  Space,
  Switch,
  ConfigProvider,
  Avatar,
  Dropdown,
  message,
} from 'antd';
import {
  HomeOutlined,
  ScissorOutlined,
  CalendarOutlined,
  UserOutlined,
  MenuOutlined,
  BulbOutlined,
  LogoutOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Barbearia from './pages/Barbearia';
import Home from './pages/home';
import Perfil from './pages/Perfil';
import { darkTheme, lightTheme, type AppThemeMode } from './theme';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectRoute';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  themeMode: AppThemeMode;
  toggleTheme: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ themeMode, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isDarkMode = themeMode === 'dark';
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Início',
    },
    {
      key: '/barbearia',
      icon: <ScissorOutlined />,
      label: 'Barbearias',
      children: [
        {
          key: '/barbearia/jo',
          label: 'Barbearia do Jô',
        },
        {
          key: '/barbearia/ze',
          label: 'Barbearia do Zé',
        },
        {
          key: '/barbearia/rei',
          label: 'Rei da Navalha',
        },
        {
          key: '/barbearia/elite',
          label: 'Elite Barber',
        },
      ],
    },
    {
      key: '/agendamentos',
      icon: <CalendarOutlined />,
      label: 'Agendamentos',
    },
    {
      key: '/perfil',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
  ];

  const onMenuClick = ({ key }: { key: string }) => {
    window.location.href = key;
  };

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logout realizado com sucesso!');
    } catch (error) {
      message.error('Erro ao fazer logout');
    }
  };

  // Items do dropdown do usuário
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Meu Perfil',
      onClick: () => window.location.href = '/perfil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configurações',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ];

  // Recuperar preferências do tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') as AppThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      // O tema já foi carregado no componente pai
    }
  }, []);

  // Determinar a chave selecionada do menu baseada na rota atual
  const getSelectedKeys = () => {
    const pathname = location.pathname;
    if (pathname.startsWith('/barbearia/')) {
      return [pathname];
    }
    return [pathname];
  };

  return (
    <ConfigProvider theme={currentTheme}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme={isDarkMode ? 'dark' : 'light'}
          width={250}
          style={{
            background: currentTheme.components?.Layout?.siderBg,
          }}
        >
          <div
            style={{
              height: currentTheme.components?.Layout?.headerHeight || 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? 0 : '0 16px',
              borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
            }}
          >
            {!collapsed ? (
              <Title
                level={4}
                style={{
                  margin: 0,
                  color: currentTheme.token.colorPrimary,
                  fontWeight: 700,
                }}
              >
                BarberApp
              </Title>
            ) : (
              <ScissorOutlined
                style={{
                  fontSize: '24px',
                  color: currentTheme.token.colorPrimary,
                }}
              />
            )}
          </div>

          <Menu
            theme={isDarkMode ? 'dark' : 'light'}
            selectedKeys={getSelectedKeys()}
            mode="inline"
            items={menuItems}
            onClick={onMenuClick}
            style={{ borderRight: 0 }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: currentTheme.components?.Layout?.headerBg,
              borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: currentTheme.components?.Layout?.headerHeight || 64,
            }}
          >
            <Space>
              <Title
                level={3}
                style={{
                  margin: 0,
                  color: currentTheme.token.colorTextBase,
                  fontWeight: 600,
                }}
              >
                Sistema de Agendamento
              </Title>
            </Space>

            <Space size="large">
              {/* Theme Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: currentTheme.token.borderRadius,
                  background: isDarkMode
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
                }}
              >
                <SunOutlined
                  style={{
                    color: isDarkMode ? '#64748b' : currentTheme.token.colorPrimary,
                    fontSize: 14,
                  }}
                />
                <Switch
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  size="small"
                  checkedChildren={<MoonOutlined style={{ fontSize: 12 }} />}
                  unCheckedChildren={<SunOutlined style={{ fontSize: 12 }} />}
                />
                <MoonOutlined
                  style={{
                    color: isDarkMode ? currentTheme.token.colorPrimary : '#64748b',
                    fontSize: 14,
                  }}
                />
              </div>

              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <Button
                  type="text"
                  style={{
                    padding: '8px 12px',
                    height: 'auto',
                    borderRadius: currentTheme.token.borderRadius,
                  }}
                >
                  <Space>
                    <Avatar
                      size="small"
                      src={user?.avatar}
                      icon={!user?.avatar && <UserOutlined />}
                      style={{
                        backgroundColor: currentTheme.token.colorPrimary,
                      }}
                    />
                    <span style={{
                      color: currentTheme.token.colorTextBase,
                      fontWeight: 500,
                    }}>
                      {user?.name || 'Usuário'}
                    </span>
                  </Space>
                </Button>
              </Dropdown>
            </Space>
          </Header>

          <Content
            style={{
              margin: 0,
              background: currentTheme.components?.Layout?.bodyBg,
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: currentTheme.token.colorBgContainer,
                margin: 16,
                borderRadius: currentTheme.token.borderRadius,
                boxShadow: isDarkMode
                  ? '0 4px 12px rgba(0, 0, 0, 0.4)'
                  : '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/barbearia/:id" element={<Barbearia />} />
                <Route
                  path="/agendamentos"
                  element={<div>Página de Agendamentos</div>}
                />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

const AppRouter = () => {
  const [themeMode, setThemeMode] = useState<AppThemeMode>('light');

  // Recuperar e salvar preferências do tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode') as AppThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeMode(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: AppThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('themeMode', newTheme);
  };

  return (
    <Router>
      <ProtectedRoute
        isDarkMode={themeMode === 'dark'}
        toggleTheme={toggleTheme}
      >
        <AppLayout themeMode={themeMode} toggleTheme={toggleTheme} />
      </ProtectedRoute>
    </Router>
  );
};

export default AppRouter;
