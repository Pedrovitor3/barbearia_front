import { PlusOutlined } from '@ant-design/icons';
import { Flex, Button, message, Divider, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Adicionado para navegação
import './index.css';
import BarbeariaCard from '../../components/Card/BarbeariaCard';
import ModalBarbearia from '../../components/Modal/EmpresaModal';
import {
  CreateEmpresaService,
  GetEmpresaService,
} from '../../services/empresaService';
import type {
  EmpresaFormData,
  EmpresaInterface,
} from '../../interfaces/EmpresaInterface';

const Home = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [selectedBarbearia, setSelectedBarbearia] =
    useState<EmpresaInterface | null>(null);

  useEffect(() => {
    // Carregar barbearias ao montar o componente
    loadBarbearias();
  }, []);

  const loadBarbearias = async () => {
    try {
      const response = await GetEmpresaService();
      console.log('response', response);
      setEmpresas(Array.isArray(response)? response : []);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      message.error('Erro ao carregar empresas');
    }
  };

  const handleOpenBarbearia = (empresaId: number) => {
    console.log('Navegando para empresa ID:', empresaId);
    // Navegar para a página da empresa usando o ID
    navigate(`/empresa/${empresaId}`);
  };

  const handleSettingsClick = (id: number) => {
    const barbearia = empresas.find(b => b.empresaId === id);
    if (barbearia) {
      setSelectedBarbearia(barbearia);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleMoreOptionsClick = (id: number) => {
    console.log('Mais opções', id);
    // Aqui você pode implementar um dropdown com mais opções
    // como excluir, duplicar, etc.
  };

  const handleOpenCreateModal = () => {
    setSelectedBarbearia(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedBarbearia(null);
  };

  const handleSubmitEmpresa = async (id: number, data: EmpresaFormData) => {
    try {
      setLoading(true);

      // Simular delay de API (remover em produção)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditing && id) {
        // Atualizar empresa existente
        const empresaAtualizada: EmpresaInterface = {
          ...selectedBarbearia!,
          nomeFantasia: data.nomeFantasia,
          slug: data.slug,
          razaoSocial: data.razaoSocial,
          cnpj: data.cnpj,
          updatedAt: new Date().toISOString(),
        };

        setEmpresas(prev =>
          prev.map(emp => (emp.empresaId === id ? empresaAtualizada : emp))
        );

        message.success('Empresa atualizada com sucesso!');
      } else {
        // Criar nova empresa
        const novaEmpresa: EmpresaInterface = {
          empresaId: Date.now(),
          nomeFantasia: data.nomeFantasia,
          slug: data.slug,
          razaoSocial: data.razaoSocial,
          cnpj: data.cnpj,
          ativo: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
        };

        await CreateEmpresaService(novaEmpresa);

        // Recarregar a lista após criar
        await loadBarbearias();
        message.success('Empresa criada com sucesso!');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
      message.error('Erro ao salvar empresa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header com botão de criar */}
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Barbearias
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            {empresas.length} barbearia{empresas.length !== 1 ? 's' : ''}{' '}
            encontrada{empresas.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreateModal}
          size="large"
        >
          Nova Barbearia
        </Button>
      </div>

      {/* Cards das barbearias */}
      <Flex wrap gap="middle" justify="start">
        {empresas.length > 0 ? empresas?.map(emp => (
          <BarbeariaCard
            key={emp.empresaId}
            empresa={emp}
            onCardClick={handleOpenBarbearia}
            onSettingsClick={handleSettingsClick}
            onMoreOptionsClick={handleMoreOptionsClick}
          />
        )):(<Divider>
          <Typography.Text style={{ width: '100%', textAlign: 'center' }}>
          Nenhuma barbearia encontrada.
        </Typography.Text>
          </Divider>
        )}
      </Flex>

      {/* Modal unificado para criar/editar */}
      <ModalBarbearia
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitEmpresa}
        loading={loading}
        empresa={selectedBarbearia}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Home;
