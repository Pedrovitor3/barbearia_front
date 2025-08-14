import { PlusOutlined } from '@ant-design/icons';
import { Flex, Button, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import './index.css';
import FuncionarioCard from '../../components/Card/FuncionarioCard';
import FuncionarioModal from '../../components/Modal/FuncionarioModal';
import {
  CreateFuncionarioService,
  GetFuncionarioService,
} from '../../services/funcionarioService';
import type {
  FuncionarioFormData,
  FuncionarioInterface,
} from '../../interfaces/FuncionarioInterface';

const Funcionarios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [funcionarios, setFuncionarios] = useState<FuncionarioInterface[]>([]);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<FuncionarioInterface | null>(null);
  const empresaId = 2; // Este valor deveria vir do contexto/rota

  useEffect(() => {
    // Carregar funcionários ao montar o componente
    loadFuncionarios();
  }, []);

  const loadFuncionarios = async () => {
    try {
      setPageLoading(true);
      const response = await GetFuncionarioService();
      console.log('response funcionarios', response);
      setFuncionarios(response);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      message.error('Erro ao carregar funcionários. Tente novamente.');
    } finally {
      setPageLoading(false);
    }
  };

  const handleOpenFuncionario = (id: number) => {
    console.log('funcionario id', id);
    // Aqui você pode implementar navegação para página de detalhes do funcionário
    // ou abrir modal com mais informações
  };

  const handleSettingsClick = (id: number) => {
    const funcionario = funcionarios.find(f => f.funcionarioId === id);
    if (funcionario) {
      setSelectedFuncionario(funcionario);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleMoreOptionsClick = (id: number) => {
    console.log('Mais opções funcionário', id);
    // Aqui você pode implementar um dropdown com mais opções
    // como excluir, desativar, etc.
    const funcionario = funcionarios.find(f => f.funcionarioId === id);
    if (funcionario) {
      // Exemplo: confirmar exclusão
      // Modal.confirm({
      //   title: 'Confirmar exclusão',
      //   content: `Deseja excluir o funcionário ${funcionario.pessoa.nome} ${funcionario.pessoa.sobrenome}?`,
      //   onOk: () => handleDeleteFuncionario(id),
      // });
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedFuncionario(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedFuncionario(null);
  };

  const handleSubmitFuncionario = async (
    id: number,
    data: FuncionarioFormData
  ) => {
    try {
      setLoading(true);
      const dataLimpa = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''), // Remove pontos, hífens e outros caracteres não numéricos
      };
      console.log('Dados do formulário:', dataLimpa);
      if (isEditing && id) {
        // Atualizar funcionário existente
        // const funcionarioAtualizado = await UpdateFuncionarioService(id, data);

        // setFuncionarios(prev =>
        //   prev.map(func =>
        //     func.funcionarioId === id ? funcionarioAtualizado : func
        //   )
        // );

        message.success('Funcionário atualizado com sucesso!');
      } else {
        // Criar novo funcionário
        const novoFuncionario = await CreateFuncionarioService({
          ...dataLimpa,
          empresaId: empresaId, // Usar o ID da empresa atual
        });

        setFuncionarios(prev => [...prev, novoFuncionario]);
        message.success('Funcionário criado com sucesso!');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      message.error('Erro ao salvar funcionário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFuncionario = async (id: number) => {
    try {
      // await DeleteFuncionarioService(id);
      // setFuncionarios(prev => prev.filter(func => func.funcionarioId !== id));
      message.success('Funcionário excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      message.error('Erro ao excluir funcionário. Tente novamente.');
    }
  };

  const funcionariosAtivos = funcionarios.filter(f => f.ativo);
  const totalFuncionarios = funcionarios.length;

  if (pageLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

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
            Funcionários
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            {totalFuncionarios} funcionário{totalFuncionarios !== 1 ? 's' : ''}{' '}
            {totalFuncionarios > 0 && (
              <>
                • {funcionariosAtivos.length} ativo
                {funcionariosAtivos.length !== 1 ? 's' : ''}
                {totalFuncionarios > funcionariosAtivos.length && (
                  <>
                    {' '}
                    • {totalFuncionarios - funcionariosAtivos.length} inativo
                    {totalFuncionarios - funcionariosAtivos.length !== 1
                      ? 's'
                      : ''}
                  </>
                )}
              </>
            )}
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreateModal}
          size="large"
        >
          Novo Funcionário
        </Button>
      </div>

      {/* Cards dos funcionários */}
      {funcionarios.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999',
          }}
        >
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Nenhum funcionário cadastrado ainda.
          </p>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
          >
            Cadastrar Primeiro Funcionário
          </Button>
        </div>
      ) : (
        <Flex wrap gap="middle" justify="start">
          {funcionarios.map(funcionario => (
            <FuncionarioCard
              key={funcionario.funcionarioId}
              funcionario={funcionario}
              onCardClick={handleOpenFuncionario}
              onSettingsClick={handleSettingsClick}
              onMoreOptionsClick={handleMoreOptionsClick}
            />
          ))}
        </Flex>
      )}

      {/* Modal unificado para criar/editar */}
      <FuncionarioModal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitFuncionario}
        loading={loading}
        funcionario={selectedFuncionario}
        isEditing={isEditing}
        empresaId={empresaId}
      />
    </div>
  );
};

export default Funcionarios;
