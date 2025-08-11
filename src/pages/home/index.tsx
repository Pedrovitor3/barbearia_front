import { PlusOutlined } from '@ant-design/icons';
import { Flex, Button, message, type UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import barbeariaJoImg from '../../assets/BarbeariaImagens/barbeariaJo.png';
import './index.css';
import BarbeariaCard from '../../components/Card/BarbeariaCard';
import ModalBarbearia from '../../components/Modal/BarbeariaModal';
import { GetEmpresaService } from '../../services/empresaService';
import type { EmpresaInterface } from '../../interfaces/EmpresaInterface';

interface BarbeariaFormData {
  nome: string;
  descricao: string;
  bairro: string;
  cidade: string;
  telefone: string;
  horarioFuncionamento: string;
  preco: number;
  barbeiros?: string[];
  imagem?: UploadFile[];
}

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [empresas, setEmpresas] = useState<EmpresaInterface[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [selectedBarbearia, setSelectedBarbearia] =
    useState<EmpresaInterface | null>(null);

  useEffect(() => {
    // Carregar barbearias ao montar o componente
    loadBarbearias();
  }, []);

  const loadBarbearias = async () => {
    const response = await GetEmpresaService();
    console.log('response', response);
    setEmpresas(response);
  };

  const handleOpenBarbearia = (id: number) => {
    console.log('barbearia id', id);
    // Aqui você pode implementar navegação para página de detalhes
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

  const handleSubmitBarbearia = async (id: number, data: BarbeariaFormData) => {
    try {
      setLoading(true);

      // Simular delay de API (remover em produção)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditing && id) {
        // Atualizar barbearia existente
        // const empresaAtualizada: EmpresaInterface = {
        const empresaAtualizada: any = {
          // empresaId,
          nomeFantasia: data.nome,
          email: data.descricao,
          // bairro: data.bairro,
          // cidade: data.cidade,
          // image:
          //   data.imagem?.[0]?.url ||
          //   data.imagem?.[0]?.thumbUrl ||
          //   selectedBarbearia?.image ||
          //   barbeariaJoImg,
          // barbeiros: data.barbeiros || [],
          telefone: data.telefone,
          // horarioFuncionamento: data.horarioFuncionamento,
        };

        setEmpresas(prev =>
          prev.map(emp => (emp.empresaId === id ? empresaAtualizada : emp))
        );

        message.success('Barbearia atualizada com sucesso!');
      } else {
        // Criar nova barbearia
        const newId = Date.now().toString();
        const novaBarbearia: any = {
          empresaId: newId,
          title: data.nome,
          descricao: data.descricao,
          bairro: data.bairro,
          cidade: data.cidade,
          image: data.imagem?.[0]?.thumbUrl || barbeariaJoImg,
          barbeiros: data.barbeiros || [],
          telefone: data.telefone,
          horarioFuncionamento: data.horarioFuncionamento,
          preco: data.preco,
        };

        setEmpresas(prev => [...prev, novaBarbearia]);
        message.success('Barbearia criada com sucesso!');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar barbearia:', error);
      message.error('Erro ao salvar barbearia. Tente novamente.');
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
        {empresas.map(emp => (
          <BarbeariaCard
            key={emp.empresaId}
            empresa={emp}
            onCardClick={handleOpenBarbearia}
            onSettingsClick={handleSettingsClick}
            onMoreOptionsClick={handleMoreOptionsClick}
          />
        ))}
      </Flex>

      {/* Modal unificado para criar/editar */}
      <ModalBarbearia
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitBarbearia}
        loading={loading}
        empresa={selectedBarbearia}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Home;
