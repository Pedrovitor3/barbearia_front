// components/ProtectedRoute.tsx
import React from 'react';
import { Spin } from 'antd';
import { useAuth } from '../../context/AuthContext';
import Login from '../../pages/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isDarkMode = false,
  toggleTheme = () => {}
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDarkMode ? '#0b1220' : '#f0f2f5',
        }}
      >
        <Spin size="large" tip="Carregando..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
