// pages/Login.tsx - Versão Minimalista
import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Switch,
  theme,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MoonOutlined,
  SunOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { useToken } = theme;

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ isDarkMode, toggleTheme }) => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');

  const { token } = useToken();
  const { login, isAuthenticated } = useAuth();
  const [form] = Form.useForm<LoginFormData>();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  const showMessage = (type: 'error' | 'success', content: string) => {
    setAlertType(type);
    setAlertMessage(content);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setShowAlert(false);

    try {
      const success = await login(values.username, values.password);
      if (success) {
        showMessage('success', 'Login realizado com sucesso!');
        // Redirecionar será feito automaticamente pelo useEffect
      }
    } catch (error: any) {
      showMessage('error', error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
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
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Theme Toggle */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            borderRadius: 8,
            background: isDarkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(51,65,85,0.3)' : 'rgba(203,213,225,0.3)'}`,
          }}
        >
          <SunOutlined
            style={{
              color: isDarkMode ? '#64748b' : '#f59e0b',
              fontSize: 14,
            }}
          />
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            size="small"
          />
          <MoonOutlined
            style={{
              color: isDarkMode ? '#3b82f6' : '#64748b',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: 16,
          border: 'none',
          background: isDarkMode ? '#1e293b' : '#ffffff',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: isDarkMode
                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <UserOutlined style={{ fontSize: 24, color: '#ffffff' }} />
          </div>

          <Title
            level={2}
            style={{
              margin: '0 0 8px 0',
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              fontWeight: 600,
              fontSize: 24,
            }}
          >
            Entre na sua conta
          </Title>

          <Text
            style={{
              color: isDarkMode ? '#94a3b8' : '#64748b',
              fontSize: 14,
            }}
          >
            Acesse o sistema de agendamento
          </Text>
        </div>

        {/* Alert */}
        {showAlert && (
          <div style={{ marginBottom: 24 }}>
            <Alert
              message={alertMessage}
              type={alertType}
              showIcon
              closable
              onClose={() => setShowAlert(false)}
              style={{
                borderRadius: 8,
                border: 'none',
              }}
            />
          </div>
        )}

        {/* Form */}
        <Form
          form={form}
          name="login"
          size="large"
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            label={
              <span
                style={{
                  fontWeight: 500,
                  color: isDarkMode ? '#f1f5f9' : '#374151',
                }}
              >
                Usuário
              </span>
            }
            rules={[
              { required: true, message: 'Por favor, insira seu usuário!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Digite seu usuário"
              style={{
                height: 48,
                borderRadius: 8,
                border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f9fafb' : '#111827',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span
                style={{
                  fontWeight: 500,
                  color: isDarkMode ? '#f1f5f9' : '#374151',
                }}
              >
                Senha
              </span>
            }
            rules={[
              { required: true, message: 'Por favor, insira sua senha!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Digite sua senha"
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={{
                height: 48,
                borderRadius: 8,
                border: `1px solid ${isDarkMode ? '#374151' : '#d1d5db'}`,
                background: isDarkMode ? '#374151' : '#ffffff',
                color: isDarkMode ? '#f9fafb' : '#111827',
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: '100%',
                height: 48,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                border: 'none',
                background: isDarkMode
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.25)',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? '#64748b' : '#9ca3af',
            }}
          >
            © 2025 BarberApp. Todos os direitos reservados.
          </Text>
        </div>
      </Card>

      {/* CSS customizado */}
      <style>{`
        .ant-input:focus,
        .ant-input-password:focus,
        .ant-input-affix-wrapper:focus {
          border-color: ${isDarkMode ? '#3b82f6' : '#6366f1'} !important;
          box-shadow: 0 0 0 2px ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(99, 102, 241, 0.2)'} !important;
        }

        .ant-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px 0 rgba(0, 118, 255, 0.35) !important;
        }

        .ant-form-item-has-error .ant-input,
        .ant-form-item-has-error .ant-input-affix-wrapper {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
        }

        .ant-input-affix-wrapper {
          background: ${isDarkMode ? '#374151' : '#ffffff'} !important;
        }

        .ant-input-affix-wrapper > input {
          background: transparent !important;
          color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
        }

        .ant-input-affix-wrapper .ant-input-password-icon {
          color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
};

export default Login;
