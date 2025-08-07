// pages/Login.tsx
import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Divider,
  Checkbox,
  Row,
  Col,
  Switch,
  theme,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  ScissorOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import type { LoginCredentials, RegisterCredentials } from '../../services/login';

const { Title, Text, Link } = Typography;
const { useToken } = theme;

interface LoginProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ isDarkMode, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { token } = useToken();

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values: LoginCredentials) => {
    setLoading(true);
    const success = await login(values);
    setLoading(false);

    if (success) {
      // O redirecionamento será feito automaticamente pelo AppRouter
    }
  };

  const handleRegister = async (values: RegisterCredentials & { confirm: string }) => {
    setLoading(true);
    const { confirm, ...registerData } = values;
    const success = await register(registerData);
    setLoading(false);

    if (success) {
      // O redirecionamento será feito automaticamente pelo AppRouter
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode
          ? 'linear-gradient(135deg, #0b1220 0%, #1e293b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Theme Toggle - Posicionado no canto superior direito */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        <Card
          size="small"
          style={{
            borderRadius: token.borderRadius,
            border: `1px solid ${isDarkMode ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.3)'}`,
            background: isDarkMode
              ? 'rgba(15,23,42,0.8)'
              : 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Space align="center">
            <SunOutlined style={{ color: isDarkMode ? '#64748b' : '#fbbf24' }} />
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{
                backgroundColor: isDarkMode ? token.colorPrimary : '#10b981',
              }}
            />
            <MoonOutlined style={{ color: isDarkMode ? '#22d3ee' : '#64748b' }} />
          </Space>
        </Card>
      </div>

      <Row justify="center" style={{ width: '100%', maxWidth: 1200 }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            style={{
              boxShadow: isDarkMode
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(34,211,238,0.1)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.2)',
              borderRadius: token.borderRadius * 1.5,
              border: 'none',
              background: isDarkMode
                ? token.colorBgContainer
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Space direction="vertical" size="small">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: isDarkMode
                      ? '0 8px 32px rgba(34,211,238,0.3)'
                      : '0 8px 32px rgba(16,185,129,0.3)',
                  }}
                >
                  <ScissorOutlined
                    style={{
                      fontSize: 28,
                      color: '#ffffff',
                    }}
                  />
                </div>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: token.colorPrimary,
                    fontWeight: 700,
                  }}
                >
                  BarberApp
                </Title>
                <Text
                  type="secondary"
                  style={{
                    fontSize: 16,
                    color: isDarkMode ? '#94a3b8' : '#64748b',
                  }}
                >
                  Sistema de Agendamento para Barbearias
                </Text>
              </Space>
            </div>

            {/* Toggle Buttons */}
            <div style={{ marginBottom: 32 }}>
              <Button.Group style={{ width: '100%' }}>
                <Button
                  type={isLogin ? 'primary' : 'default'}
                  size="large"
                  style={{
                    width: '50%',
                    height: 48,
                    fontWeight: 600,
                    borderRadius: `${token.borderRadius}px 0 0 ${token.borderRadius}px`,
                  }}
                  onClick={() => setIsLogin(true)}
                >
                  Entrar
                </Button>
                <Button
                  type={!isLogin ? 'primary' : 'default'}
                  size="large"
                  style={{
                    width: '50%',
                    height: 48,
                    fontWeight: 600,
                    borderRadius: `0 ${token.borderRadius}px ${token.borderRadius}px 0`,
                  }}
                  onClick={() => setIsLogin(false)}
                >
                  Registrar
                </Button>
              </Button.Group>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <Form
                form={loginForm}
                name="login"
                size="large"
                onFinish={handleLogin}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="email"
                  label={<span style={{ fontWeight: 600 }}>Email</span>}
                  rules={[
                    { required: true, message: 'Por favor, insira seu email!' },
                    { type: 'email', message: 'Email inválido!' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="seu@email.com"
                    style={{
                      height: 48,
                      borderRadius: token.borderRadius,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span style={{ fontWeight: 600 }}>Senha</span>}
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha!' },
                    { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="Sua senha"
                    style={{
                      height: 48,
                      borderRadius: token.borderRadius,
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox style={{ fontWeight: 500 }}>Lembrar de mim</Checkbox>
                    </Form.Item>
                    <Link
                      href="#"
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: token.colorPrimary,
                      }}
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      width: '100%',
                      height: 52,
                      borderRadius: token.borderRadius,
                      fontWeight: 600,
                      fontSize: 16,
                      boxShadow: isDarkMode
                        ? '0 4px 14px 0 rgba(34,211,238,0.2)'
                        : '0 4px 14px 0 rgba(16,185,129,0.2)',
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              /* Register Form */
              <Form
                form={registerForm}
                name="register"
                size="large"
                onFinish={handleRegister}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="name"
                  label={<span style={{ fontWeight: 600 }}>Nome completo</span>}
                  rules={[
                    { required: true, message: 'Por favor, insira seu nome!' },
                    { min: 2, message: 'Nome deve ter pelo menos 2 caracteres!' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="Seu nome completo"
                    style={{
                      height: 48,
                      borderRadius: token.borderRadius,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label={<span style={{ fontWeight: 600 }}>Email</span>}
                  rules={[
                    { required: true, message: 'Por favor, insira seu email!' },
                    { type: 'email', message: 'Email inválido!' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="seu@email.com"
                    style={{
                      height: 48,
                      borderRadius: token.borderRadius,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={<span style={{ fontWeight: 600 }}>Telefone (opcional)</span>}
                  rules={[
                    { pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/, message: 'Formato: (11) 99999-9999' },
                  ]}
                >
                  <Input
                    placeholder="(11) 99999-9999"
                    style={{
                      height: 48,
                      borderRadius: token.borderRadius,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span style={{ fontWeight: 600 }}>Senha</span>}
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha!' },
                    { min: 6, message: 'A senha deve ter pelo menos 6 caracteres!' },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="Sua senha"
                    style={{
                      height: 48,
                      borderRadius: token.borderRadius,
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label={<span style={{ fontWeight: 600 }}>Confirmar senha</span>}
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Por favor, confirme sua senha!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('As senhas não coincidem!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: token.colorTextTertiary }} />}
                    placeholder="Confirme sua senha"
                    style={{
                      height: 48,
                      borderRadius: token.borderRadius,
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      width: '100%',
                      height: 52,
                      borderRadius: token.borderRadius,
                      fontWeight: 600,
                      fontSize: 16,
                      boxShadow: isDarkMode
                        ? '0 4px 14px 0 rgba(34,211,238,0.2)'
                        : '0 4px 14px 0 rgba(16,185,129,0.2)',
                    }}
                  >
                    {loading ? 'Registrando...' : 'Criar Conta'}
                  </Button>
                </Form.Item>
              </Form>
            )}

            <Divider style={{ margin: '24px 0' }}>
              <Text
                type="secondary"
                style={{
                  fontWeight: 500,
                  color: isDarkMode ? '#64748b' : '#6b7280',
                }}
              >
                Acesso rápido
              </Text>
            </Divider>

            <div style={{ textAlign: 'center' }}>
              <Text
                type="secondary"
                style={{
                  fontSize: 12,
                  color: isDarkMode ? '#64748b' : '#6b7280',
                }}
              >
                Ao continuar, você aceita nossos{' '}
                <Link
                  href="#"
                  style={{
                    fontSize: 12,
                    color: token.colorPrimary,
                    fontWeight: 500,
                  }}
                >
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link
                  href="#"
                  style={{
                    fontSize: 12,
                    color: token.colorPrimary,
                    fontWeight: 500,
                  }}
                >
                  Política de Privacidade
                </Link>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
