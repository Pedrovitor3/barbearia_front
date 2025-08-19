import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Flex,
  Button,
  message,
  Spin,
  Table,
  Tag,
  Space,
  Avatar,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import type {
  FuncionarioFormData,
  FuncionarioInterface,
} from '../../interfaces/FuncionarioInterface';
import { CreateFuncionarioService } from '../../services/funcionarioService';
import FuncionarioModal from '../Modal/FuncionarioModal';
import type { ColumnsType } from 'antd/es/table';

interface FuncionariosTabProps {
  empresaId: number;
  funcionarios: FuncionarioInterface[];
  onFuncionariosUpdate: (funcs: FuncionarioInterface[]) => void;
}

const FuncionariosTab: React.FC<FuncionariosTabProps> = ({
  empresaId,
  funcionarios,
  onFuncionariosUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<FuncionarioInterface | null>(null);

  const handleOpenFuncionario = (id: number) => {
    console.log('funcionario id', id);
    // Implementar navegação para página de detalhes do funcionário
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
    const funcionario = funcionarios.find(f => f.funcionarioId === id);
    if (funcionario) {
      // Implementar dropdown com opções como excluir, desativar, etc.
      // Exemplo de confirmação de exclusão:
      // Modal.confirm({
      //   title: 'Confirmar exclusão',
      //   content: `Deseja excluir o funcionário ${funcionario.pessoa.nome} ${funcionario.pessoa.sobrenome}?`,
      //   onOk: () => handleDeleteFuncionario(id),
      // });
    }
  };

  const handleOpenModalFuncionario = () => {
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
        cpf: data.cpf.replace(/\D/g, ''),
      };

      console.log('Dados do formulário:', dataLimpa);

      if (isEditing && id) {
        // Atualizar funcionário existente
        // const funcionarioAtualizado = await UpdateFuncionarioService(id, dataLimpa);
        // onFuncionariosUpdate(
        //   funcionarios.map(func =>
        //     func.funcionarioId === id ? funcionarioAtualizado : func
        //   )
        // );
        message.success('Funcionário atualizado com sucesso!');
      } else {
        // Criar novo funcionário
        const novoFuncionario = await CreateFuncionarioService({
          ...dataLimpa,
          empresaId: empresaId,
        });

        // Update the funcionarios list using the prop function
        onFuncionariosUpdate([...funcionarios, novoFuncionario]);
        message.success('Funcionário criado com sucesso!');
      }

      handleCloseModal();
    } catch (error: any) {
      // ... existing error handling
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModalFuncionario = () => {
    setIsModalOpen(false);
  };

  const handleEditFuncionario = (id: number) => {
    const funcionario = funcionarios.find(f => f.funcionarioId === id);
    setSelectedFuncionario(funcionario || null);

    setIsModalOpen(true);
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

  // Colunas da tabela de funcionários
  const funcionariosColumns: ColumnsType<FuncionarioInterface> = [
    {
      title: 'Funcionário',
      key: 'funcionario',
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>
              {record.pessoa.nome} {record.pessoa.sobrenome}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              CPF: {record.pessoa.cpf}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
      render: (cargo: string) => (
        <Tag
          color={
            cargo === 'dono' ? 'gold' : cargo === 'gerente' ? 'blue' : 'default'
          }
        >
          {cargo.charAt(0).toUpperCase() + cargo.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Data Admissão',
      dataIndex: 'dataAdmissao',
      key: 'dataAdmissao',
      render: (data: string) => new Date(data).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.ativo ? 'green' : 'red'}>
          {record.ativo ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditFuncionario(record.funcionarioId)}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDeleteFuncionario(record.funcionarioId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (isEditing) {
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
      {/* Cards dos funcionários */}

      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenModalFuncionario}
        >
          Adicionar Funcionário
        </Button>
      </div>
      <Table
        dataSource={funcionarios}
        columns={funcionariosColumns}
        rowKey="funcionarioId"
        pagination={false}
      />

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

export default FuncionariosTab;
