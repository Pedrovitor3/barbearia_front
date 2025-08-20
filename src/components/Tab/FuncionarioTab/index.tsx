import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Spin, Table, Tag, Space, Avatar, Tooltip, App } from 'antd';
import { useState } from 'react';
import type {
  FuncionarioFormData,
  FuncionarioInterface,
} from '../../../interfaces/FuncionarioInterface';
import {
  CreateFuncionarioService,
  DeleteFuncionarioService,
  UpdateFuncionarioService,
} from '../../../services/funcionarioService';
import FuncionarioModal from '../../Modal/FuncionarioModal';
import type { ColumnsType } from 'antd/es/table';

interface FuncionariosTabProps {
  empresaId: number;
  funcionarios: FuncionarioInterface[];
  onFuncionariosUpdate: (funcs: FuncionarioInterface[]) => void;
}

const FuncionariosTabContent: React.FC<FuncionariosTabProps> = ({
  empresaId,
  funcionarios,
  onFuncionariosUpdate,
}) => {
  const { message } = App.useApp(); // Use the App context for message
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<FuncionarioInterface | null>(null);

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
        const funcionarioAtualizado = await UpdateFuncionarioService(
          id,
          dataLimpa
        );
        onFuncionariosUpdate(
          funcionarios.map(func =>
            func.funcionarioId === id ? funcionarioAtualizado : func
          )
        );
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
      console.error('Erro ao criar/atualizar funcionário:', error);
      message.error('Erro ao processar funcionário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFuncionario = (id: number) => {
    const funcionario = funcionarios.find(f => f.funcionarioId === id);
    console.log('func', funcionario);
    setSelectedFuncionario(funcionario || null);
    setIsEditing(true); // Set isEditing to true when editing
    setIsModalOpen(true);
  };

  const handleDeleteFuncionario = async (id: number) => {
    try {
      await DeleteFuncionarioService(id);
      onFuncionariosUpdate(
        funcionarios.filter(func => func.funcionarioId !== id)
      );
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
              {/* Add null checks for pessoa object */}
              {record?.pessoa?.nome || 'N/A'} {record?.pessoa?.sobrenome || ''}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              CPF: {record?.pessoa?.cpf || 'N/A'}
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
          {cargo?.charAt(0).toUpperCase() + cargo?.slice(1) || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Data Admissão',
      dataIndex: 'dataAdmissao',
      key: 'dataAdmissao',
      render: (data: string) =>
        data ? new Date(data).toLocaleDateString('pt-BR') : 'N/A',
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

  if (isEditing && loading) {
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

// Wrapper component with App provider
const FuncionariosTab: React.FC<FuncionariosTabProps> = props => {
  return (
    <App>
      <FuncionariosTabContent {...props} />
    </App>
  );
};

export default FuncionariosTab;
