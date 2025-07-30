import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Typography,
  Space,
  Switch,
  ConfigProvider,
  theme,
} from 'antd';
import {
  HomeOutlined,
  ScissorOutlined,
  CalendarOutlined,
  UserOutlined,
  MenuOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Barbearia from './pages/Barbearia';
import Home from './pages/home';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AppRouter = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            theme={isDarkMode ? 'dark' : 'light'}
            width={250}
          >
            <div
              style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? 0 : '0 16px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              {!collapsed ? (
                <Title
                  level={4}
                  style={{ margin: 0, color: isDarkMode ? '#fff' : '#1890ff' }}
                >
                  BarberApp
                </Title>
              ) : (
                <ScissorOutlined
                  style={{
                    fontSize: '24px',
                    color: isDarkMode ? '#fff' : '#1890ff',
                  }}
                />
              )}
            </div>

            <Menu
              theme={isDarkMode ? 'dark' : 'light'}
              defaultSelectedKeys={['/']}
              mode="inline"
              items={menuItems}
              onClick={onMenuClick}
              style={{ borderRight: 0 }}
            />
          </Sider>

          <Layout>
            <Header
              style={{
                padding: '0 16px',
                background: isDarkMode ? '#001529' : '#fff',
                borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Space>
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ display: 'none' }} // Escondido pois já temos o collapse no Sider
                />
                <Title
                  level={3}
                  style={{ margin: 0, color: isDarkMode ? '#fff' : 'inherit' }}
                >
                  Sistema de Agendamento
                </Title>
              </Space>

              <Space>
                <Switch
                  checkedChildren={<BulbOutlined />}
                  unCheckedChildren={<BulbOutlined />}
                  checked={isDarkMode}
                  onChange={setIsDarkMode}
                />

                <Button icon={<UserOutlined />}>Minha Conta</Button>
              </Space>
            </Header>

            <Content
              style={{ margin: 0, background: isDarkMode ? '#000' : '#f0f2f5' }}
            >
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                  background: isDarkMode ? '#141414' : '#fff',
                  margin: 16,
                  borderRadius: 8,
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/barbearia/:id" element={<Barbearia />} />
                  <Route
                    path="/agendamentos"
                    element={<div>Página de Agendamentos</div>}
                  />
                  <Route path="/perfil" element={<div>Página de Perfil</div>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default AppRouter;
