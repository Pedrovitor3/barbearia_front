// App.tsx - Versão atualizada com AuthProvider
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import AppRouter from './AppRouter';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ConfigProvider locale={ptBR}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
