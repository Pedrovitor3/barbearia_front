import { useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import AgendamentoModal from '../../Modal/AgendamentoModal';
import {
  type AgendamentoFormData,
  type AgendamentoInterface,
} from '../../../interfaces/AgendamentoInterface';

type AgendamentoTabProps = {
  empresaId: number;
};

// Componente AgendamentoTab atualizado
const AgendamentoTab = ({ empresaId }: AgendamentoTabProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agendamentos, setAgendamentos] = useState<AgendamentoInterface[]>([]);

  useEffect(() => {
    loadAgendamentos();
  }, []);

  const loadAgendamentos = () => {
    try {
      setLoading(true);
      // const response = await AgendamentoService()
      setAgendamentos([]);
      console.log('teest');
    } catch (error) {
      console.log('erro load agendamentos', error);
      throw new Error('erro load agendamentos');
    } finally {
      setLoading(false);
    }
  };

  // Colunas da tabela
  const agendamentosColumns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'agendamentoId',
      key: 'agendamentoId',
      width: 80,
    },
    {
      title: 'Cliente',
      dataIndex: 'clienteNome',
      key: 'clienteNome',
    },
    {
      title: 'Funcionário',
      dataIndex: 'funcionarioNome',
      key: 'funcionarioNome',
    },
    {
      title: 'Serviço',
      dataIndex: 'servicoNome',
      key: 'servicoNome',
    },
    {
      title: 'Data',
      dataIndex: 'dataAgendamento',
      key: 'dataAgendamento',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Horário',
      key: 'horario',
      render: (_, record) => `${record.horarioInicio} - ${record.horarioFim}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          style={{
            color:
              status === 'agendado'
                ? '#52c41a'
                : status === 'cancelado'
                  ? '#ff4d4f'
                  : '#1890ff',
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (valor: number) => (valor ? `R$ ${valor.toFixed(2)}` : '-'),
    },
  ];

  // Mock data para agendamentos

  const handleModalSubmit = async (values: AgendamentoFormData) => {
    setLoading(true);
    const dadosCompletos = { ...values, empresaId };
    try {
      // Aqui você faria a chamada para sua API
      console.log('Dados do agendamento:', values);

      setModalVisible(false);
      // Aqui você atualizaria a lista de agendamentos
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Novo Agendamento
          </Button>
          <Button>Filtros</Button>
        </Space>
      </div>

      <Table
        dataSource={agendamentos}
        columns={agendamentosColumns}
        rowKey="agendamentoId"
        pagination={{ pageSize: 10 }}
      />

      <AgendamentoModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        loading={loading}
        clientes={[]}
        funcionarios={[]}
        servicos={[]}
      />
    </div>
  );
};

export default AgendamentoTab;
