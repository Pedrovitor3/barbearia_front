// pages/Login.tsx
import React, { useState, useEffect } from 'react';
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
  message,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  ScissorOutlined,
  MoonOutlined,
  SunOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Title, Text, Link } = Typography;
const { useToken } = theme;

interface LoginFormData {
  username: string;
  password: string;
  remember?: boolean;
}

interface RegisterFormData {
  name: string;
  username: string;
  password: string;
  confirm: string;
  phone?: string;
}

interface LoginProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ isDarkMode, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');

  const { login, register } = useAuth();
  const { token } = useToken();

  const [loginForm] = Form.useForm<LoginFormData>();
  const [registerForm] = Form.useForm<RegisterFormData>();

  // Limpar formulários ao alternar entre login/registro
  useEffect(() => {
    loginForm.resetFields();
    registerForm.resetFields();
    setShowAlert(false);
  }, [isLogin, loginForm, registerForm]);

  const showMessage = (type: 'error' | 'success', content: string) => {
    setAlertType(type);
    setAlertMessage(content);
    setShowAlert(true);

    // Esconder alert após 5 segundos
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setShowAlert(false);

    try {
      const success = await login(values.username, values.password);

      if (success) {
        showMessage(
          'success',
          'Login realizado com sucesso! Redirecionando...'
        );
        // O redirecionamento será feito automaticamente pelo AppRouter
      }
    } catch (error: any) {
      showMessage('error', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    setShowAlert(false);

    try {
      const success = await register(
        values.name,
        values.username,
        values.password,
        values.phone
      );

      if (success) {
        showMessage('success', 'Conta criada com sucesso! Redirecionando...');
        // O redirecionamento será feito automaticamente pelo AppRouter
      }
    } catch (error: any) {
      showMessage('error', error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;

    // Remove tudo que não é número
    const phoneNumber = value.replace(/[^\d]/g, '');

    // Aplica a máscara (11) 99999-9999 ou (11) 9999-9999
    if (phoneNumber.length <= 10) {
      return phoneNumber.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return phoneNumber.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
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
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
          : 'linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Elementos decorativos de fundo */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />

      {/* Theme Toggle */}
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
            borderRadius: token.borderRadius * 2,
            border: `1px solid ${isDarkMode ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.4)'}`,
            background: isDarkMode
              ? 'rgba(15,23,42,0.9)'
              : 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(20px)',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          <Space align="center" size="middle">
            <SunOutlined
              style={{
                color: isDarkMode ? '#64748b' : '#fbbf24',
                fontSize: 16,
                transition: 'all 0.3s ease',
              }}
            />
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{
                backgroundColor: isDarkMode ? token.colorPrimary : '#10b981',
              }}
            />
            <MoonOutlined
              style={{
                color: isDarkMode ? '#22d3ee' : '#64748b',
                fontSize: 16,
                transition: 'all 0.3s ease',
              }}
            />
          </Space>
        </Card>
      </div>

      <Row
        justify="center"
        style={{ width: '100%', maxWidth: 1200, zIndex: 1 }}
      >
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card
            style={{
              boxShadow: isDarkMode
                ? '0 32px 64px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(34,211,238,0.15)'
                : '0 32px 64px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.3)',
              borderRadius: token.borderRadius * 2,
              border: 'none',
              background: isDarkMode
                ? 'rgba(30, 41, 59, 0.95)'
                : 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(24px)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Header aprimorado */}
            <div
              style={{
                textAlign: 'center',
                marginBottom: 40,
                position: 'relative',
              }}
            >
              {/* Gradiente decorativo */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 150,
                  height: 4,
                  background: isDarkMode
                    ? 'linear-gradient(90deg, transparent 0%, #22d3ee 50%, transparent 100%)'
                    : 'linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%)',
                  borderRadius: 2,
                }}
              />

              <Space direction="vertical" size="large">
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)'
                      : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: isDarkMode
                      ? '0 12px 40px rgba(34,211,238,0.4), inset 0 2px 4px rgba(255,255,255,0.1)'
                      : '0 12px 40px rgba(16,185,129,0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Reflexo no ícone */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      borderRadius: '50%',
                    }}
                  />
                  <ScissorOutlined
                    style={{
                      fontSize: 36,
                      color: '#ffffff',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </div>

                <div>
                  <Title
                    level={1}
                    style={{
                      margin: 0,
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                      fontSize: 32,
                      letterSpacing: '-0.025em',
                    }}
                  >
                    BarberApp
                  </Title>
                  <Text
                    style={{
                      fontSize: 18,
                      color: isDarkMode ? '#94a3b8' : '#64748b',
                      fontWeight: 500,
                      letterSpacing: '0.025em',
                    }}
                  >
                    Sistema de Agendamento para Barbearias
                  </Text>
                </div>
              </Space>
            </div>

            {/* Alert para mensagens */}
            {showAlert && (
              <div style={{ marginBottom: 24 }}>
                <Alert
                  message={alertMessage}
                  type={alertType}
                  showIcon
                  closable
                  onClose={() => setShowAlert(false)}
                  style={{
                    borderRadius: token.borderRadius,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            )}

            {/* Toggle Buttons melhorados */}
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: 'flex',
                  background: isDarkMode
                    ? 'rgba(51,65,85,0.5)'
                    : 'rgba(243,244,246,0.8)',
                  borderRadius: token.borderRadius * 1.5,
                  padding: 4,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Button
                  type={isLogin ? 'primary' : 'text'}
                  size="large"
                  style={{
                    flex: 1,
                    height: 52,
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: token.borderRadius,
                    border: 'none',
                    background: isLogin
                      ? isDarkMode
                        ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'transparent',
                    color: isLogin
                      ? '#ffffff'
                      : isDarkMode
                        ? '#94a3b8'
                        : '#64748b',
                    boxShadow: isLogin ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setIsLogin(true)}
                >
                  Entrar
                </Button>
                <Button
                  type={!isLogin ? 'primary' : 'text'}
                  size="large"
                  style={{
                    flex: 1,
                    height: 52,
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: token.borderRadius,
                    border: 'none',
                    background: !isLogin
                      ? isDarkMode
                        ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'transparent',
                    color: !isLogin
                      ? '#ffffff'
                      : isDarkMode
                        ? '#94a3b8'
                        : '#64748b',
                    boxShadow: !isLogin ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setIsLogin(false)}
                >
                  Registrar
                </Button>
              </div>
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
                style={{ position: 'relative' }}
              >
                <Form.Item
                  name="username"
                  label={
                    <span style={{ fontWeight: 600, fontSize: 16 }}>
                      Usuário
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira seu usuário!',
                    },
                    { type: 'string', message: 'Usuário inválido!' },
                  ]}
                >
                  <Input
                    prefix={
                      <MailOutlined
                        style={{ color: token.colorTextTertiary, fontSize: 18 }}
                      />
                    }
                    placeholder="Usuário"
                    style={{
                      height: 56,
                      borderRadius: token.borderRadius * 1.5,
                      fontSize: 16,
                      border: `2px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(209,213,219,0.5)'}`,
                      background: isDarkMode
                        ? 'rgba(51,65,85,0.2)'
                        : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span style={{ fontWeight: 600, fontSize: 16 }}>Senha</span>
                  }
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha!' },
                    {
                      min: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres!',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined
                        style={{ color: token.colorTextTertiary, fontSize: 18 }}
                      />
                    }
                    placeholder="Sua senha"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    style={{
                      height: 56,
                      borderRadius: token.borderRadius * 1.5,
                      fontSize: 16,
                      border: `2px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(209,213,219,0.5)'}`,
                      background: isDarkMode
                        ? 'rgba(51,65,85,0.2)'
                        : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                  >
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox
                        style={{
                          fontWeight: 500,
                          color: isDarkMode ? '#94a3b8' : '#64748b',
                        }}
                      >
                        Lembrar de mim
                      </Checkbox>
                    </Form.Item>
                    <Link
                      href="#"
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: token.colorPrimary,
                        textDecoration: 'none',
                      }}
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                </Form.Item>

                <Form.Item style={{ marginTop: 32 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      width: '100%',
                      height: 60,
                      borderRadius: token.borderRadius * 1.5,
                      fontWeight: 700,
                      fontSize: 18,
                      border: 'none',
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: isDarkMode
                        ? '0 8px 32px rgba(34,211,238,0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
                        : '0 8px 32px rgba(16,185,129,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'Entrando...' : 'Entrar na Conta'}
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
                  label={
                    <span style={{ fontWeight: 600, fontSize: 16 }}>
                      Nome completo
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Por favor, insira seu nome!' },
                    {
                      min: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres!',
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <UserOutlined
                        style={{ color: token.colorTextTertiary, fontSize: 18 }}
                      />
                    }
                    placeholder="Seu nome completo"
                    style={{
                      height: 56,
                      borderRadius: token.borderRadius * 1.5,
                      fontSize: 16,
                      border: `2px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(209,213,219,0.5)'}`,
                      background: isDarkMode
                        ? 'rgba(51,65,85,0.2)'
                        : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="username"
                  label={
                    <span style={{ fontWeight: 600, fontSize: 16 }}>
                      Usuário
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, insira seu usuário!',
                    },
                    { type: 'string', message: 'Usuário inválido!' },
                  ]}
                >
                  <Input
                    prefix={
                      <MailOutlined
                        style={{ color: token.colorTextTertiary, fontSize: 18 }}
                      />
                    }
                    placeholder="Usuário"
                    style={{
                      height: 56,
                      borderRadius: token.borderRadius * 1.5,
                      fontSize: 16,
                      border: `2px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(209,213,219,0.5)'}`,
                      background: isDarkMode
                        ? 'rgba(51,65,85,0.2)'
                        : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label={
                    <span style={{ fontWeight: 600, fontSize: 16 }}>
                      Telefone (opcional)
                    </span>
                  }
                  rules={[
                    {
                      pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                      message: 'Formato: (11) 99999-9999',
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <PhoneOutlined
                        style={{ color: token.colorTextTertiary, fontSize: 18 }}
                      />
                    }
                    placeholder="(11) 99999-9999"
                    onChange={e => {
                      const formatted = formatPhoneNumber(e.target.value);
                      registerForm.setFieldsValue({ phone: formatted });
                    }}
                    maxLength={15}
                    style={{
                      height: 56,
                      borderRadius: token.borderRadius * 1.5,
                      fontSize: 16,
                      border: `2px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(209,213,219,0.5)'}`,
                      background: isDarkMode
                        ? 'rgba(51,65,85,0.2)'
                        : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={
                    <span style={{ fontWeight: 600, fontSize: 16 }}>Senha</span>
                  }
                  rules={[
                    { required: true, message: 'Por favor, insira sua senha!' },
                    {
                      min: 6,
                      message: 'A senha deve ter pelo menos 6 caracteres!',
                    },
                    {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
                      message:
                        'A senha deve conter pelo menos uma letra e um número!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={
                      <LockOutlined
                        style={{ color: token.colorTextTertiary, fontSize: 18 }}
                      />
                    }
                    placeholder="Sua senha"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    style={{
                      height: 56,
                      borderRadius: token.borderRadius * 1.5,
                      fontSize: 16,
                      border: `2px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(209,213,219,0.5)'}`,
                      background: isDarkMode
                        ? 'rgba(51,65,85,0.2)'
                        : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label={
                    <span style={{ fontWeight: 600, fontSize: 16 }}>
                      Confirmar senha
                    </span>
                  }
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Por favor, confirme sua senha!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('As senhas não coincidem!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined
                        style={{ color: token.colorTextTertiary, fontSize: 18 }}
                      />
                    }
                    placeholder="Confirme sua senha"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    style={{
                      height: 56,
                      borderRadius: token.borderRadius * 1.5,
                      fontSize: 16,
                      border: `2px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(209,213,219,0.5)'}`,
                      background: isDarkMode
                        ? 'rgba(51,65,85,0.2)'
                        : 'rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: 32 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                      width: '100%',
                      height: 60,
                      borderRadius: token.borderRadius * 1.5,
                      fontWeight: 700,
                      fontSize: 18,
                      border: 'none',
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: isDarkMode
                        ? '0 8px 32px rgba(34,211,238,0.3), inset 0 2px 4px rgba(255,255,255,0.1)'
                        : '0 8px 32px rgba(16,185,129,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? 'Criando Conta...' : 'Criar Conta'}
                  </Button>
                </Form.Item>
              </Form>
            )}

            <Divider
              style={{
                margin: '32px 0 24px 0',
                borderColor: isDarkMode
                  ? 'rgba(51,65,85,0.3)'
                  : 'rgba(209,213,219,0.3)',
              }}
            >
              <Text
                type="secondary"
                style={{
                  fontWeight: 600,
                  color: isDarkMode ? '#64748b' : '#6b7280',
                  fontSize: 14,
                  background: isDarkMode
                    ? 'rgba(30, 41, 59, 0.95)'
                    : 'rgba(255,255,255,0.98)',
                  padding: '0 16px',
                }}
              >
                Acesso Seguro
              </Text>
            </Divider>

            {/* Footer melhorado */}
            <div style={{ textAlign: 'center' }}>
              <Space direction="vertical" size="small">
                <Text
                  type="secondary"
                  style={{
                    fontSize: 13,
                    color: isDarkMode ? '#64748b' : '#6b7280',
                    lineHeight: 1.6,
                  }}
                >
                  Ao continuar, você aceita nossos{' '}
                  <Link
                    href="#"
                    style={{
                      fontSize: 13,
                      color: token.colorPrimary,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link
                    href="#"
                    style={{
                      fontSize: 13,
                      color: token.colorPrimary,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Política de Privacidade
                  </Link>
                </Text>

                <div
                  style={{
                    marginTop: 16,
                    padding: '12px 20px',
                    background: isDarkMode
                      ? 'linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(6,182,212,0.05) 100%)'
                      : 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.05) 100%)',
                    borderRadius: token.borderRadius,
                    border: `1px solid ${isDarkMode ? 'rgba(34,211,238,0.1)' : 'rgba(16,185,129,0.1)'}`,
                  }}
                >
                  <Space>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: isDarkMode ? '#22d3ee' : '#10b981',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 12,
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        fontWeight: 500,
                      }}
                    >
                      Seus dados estão protegidos com criptografia SSL
                    </Text>
                  </Space>
                </div>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Estilos CSS para animações */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .ant-input:focus,
        .ant-input-password:focus,
        .ant-input-affix-wrapper:focus {
          border-color: ${isDarkMode ? '#22d3ee' : '#10b981'} !important;
          box-shadow: 0 0 0 2px
            ${isDarkMode ? 'rgba(34,211,238,0.2)' : 'rgba(16,185,129,0.2)'} !important;
        }

        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px
            ${isDarkMode ? 'rgba(34,211,238,0.4)' : 'rgba(16,185,129,0.4)'} !important;
        }

        .ant-form-item-has-error .ant-input,
        .ant-form-item-has-error .ant-input-affix-wrapper {
          border-color: #ff4d4f !important;
          box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2) !important;
        }

        .ant-form-item-has-success .ant-input,
        .ant-form-item-has-success .ant-input-affix-wrapper {
          border-color: ${isDarkMode ? '#22d3ee' : '#10b981'} !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
