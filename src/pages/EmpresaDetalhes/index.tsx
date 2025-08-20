import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Tabs,
  Button,
  Space,
  Typography,
  Descriptions,
  Table,
  Tag,
  Statistic,
  Row,
  Col,
  Empty,
  message,
  Spin,
} from 'antd';
import {
  ArrowLeftOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { GetOneEmpresaService } from '../../services/empresaService';
import type { FuncionarioInterface } from '../../interfaces/FuncionarioInterface';
import FuncionariosTab from '../../components/Tab/FuncionarioTab';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Interfaces
interface EmpresaDetalhes {
  empresaId: number;
  nomeFantasia: string;
  slug: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  website?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface Agendamento {
  agendamentoId: number;
  clienteNome: string;
  funcionarioNome: string;
  servico: string;
  dataHora: string;
  status:
    | 'agendado'
    | 'confirmado'
    | 'em_andamento'
    | 'concluido'
    | 'cancelado';
  valor: number;
}

const EmpresaDetalhes: React.FC = () => {
  const { empresaId } = useParams<{ empresaId: string }>();
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState<EmpresaDetalhes | null>(null);
  const [funcionarios, setFuncionarios] = useState<FuncionarioInterface[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Carregamento de dados reais da API
  useEffect(() => {
    if (empresaId) {
      loadEmpresaData();
    }
  }, [empresaId]);

  const loadEmpresaData = async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const empresaData = await GetOneEmpresaService(empresaId);
      console.log('Dados da empresa:', empresaData);
      setEmpresa(empresaData.empresa);
      setFuncionarios(empresaData?.funcionarios);
      // setAgendamentos(empresaData?.agendamentos);
    } catch (error) {
      console.error('Erro geral ao carregar dados:', error);
      message.error('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  // Colunas da tabela de agendamentos
  const agendamentosColumns: ColumnsType<Agendamento> = [
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
      dataIndex: 'servico',
      key: 'servico',
    },
    {
      title: 'Data/Hora',
      dataIndex: 'dataHora',
      key: 'dataHora',
      render: (dataHora: string) => {
        const date = new Date(dataHora);
        return (
          <div>
            <div>{date.toLocaleDateString('pt-BR')}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {date.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          agendado: 'blue',
          confirmado: 'green',
          em_andamento: 'orange',
          concluido: 'purple',
          cancelado: 'red',
        };
        const labels = {
          agendado: 'Agendado',
          confirmado: 'Confirmado',
          em_andamento: 'Em Andamento',
          concluido: 'Concluído',
          cancelado: 'Cancelado',
        };
        return (
          <Tag color={colors[status as keyof typeof colors]}>
            {labels[status as keyof typeof labels]}
          </Tag>
        );
      },
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      render: (valor: number) => `R$ ${valor.toFixed(2)}`,
    },
  ];

  const getStatusCor = (status: boolean) => (status ? '#52c41a' : '#ff4d4f');

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!empresa) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description="Empresa não encontrada" />
        <Button
          type="primary"
          onClick={() => navigate('/')}
          style={{ marginTop: 16 }}
        >
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
            Voltar
          </Button>
        </Space>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <Title level={2} style={{ margin: 0 }}>
              {empresa.nomeFantasia}
            </Title>
            <Text type="secondary">{empresa.razaoSocial}</Text>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Visão Geral */}
        <TabPane tab="Visão Geral" key="overview">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card title="Informações da Empresa">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="Nome Fantasia">
                    {empresa.nomeFantasia}
                  </Descriptions.Item>
                  <Descriptions.Item label="Razão Social">
                    {empresa.razaoSocial}
                  </Descriptions.Item>
                  <Descriptions.Item label="CNPJ">
                    {empresa.cnpj}
                  </Descriptions.Item>
                  <Descriptions.Item label="Telefone">
                    <Space>
                      <PhoneOutlined />
                      {empresa.telefone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="E-mail">
                    <Space>
                      <MailOutlined />
                      {empresa.email}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Website">
                    {empresa.website ? (
                      <Space>
                        <GlobalOutlined />
                        <a
                          href={empresa.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {empresa.website}
                        </a>
                      </Space>
                    ) : (
                      <Text type="secondary">Não informado</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusCor(empresa.ativo)}>
                      {empresa.ativo ? 'Ativo' : 'Inativo'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="middle"
              >
                <Card>
                  <Statistic
                    title="Total de Funcionários"
                    value={funcionarios.length}
                    prefix={<UserOutlined />}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Agendamentos Hoje"
                    value={agendamentos.length}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Receita do Dia"
                    value={agendamentos.reduce(
                      (acc, curr) => acc + curr.valor,
                      0
                    )}
                    prefix="R$"
                    precision={2}
                  />
                </Card>
              </Space>
            </Col>
          </Row>
        </TabPane>

        {/* Funcionários */}
        <TabPane
          tab={`Funcionários (${funcionarios.length})`}
          key="funcionarios"
        >
          <FuncionariosTab
            empresaId={empresaId ? parseInt(empresaId) : 0}
            funcionarios={funcionarios}
            onFuncionariosUpdate={setFuncionarios}
          />
        </TabPane>

        {/* Agendamentos */}
        <TabPane
          tab={`Agendamentos (${agendamentos.length})`}
          key="agendamentos"
        >
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
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
        </TabPane>

        {/* Serviços */}
        {/* <TabPane tab="Serviços" key="servicos">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Empty description="Página em desenvolvimento" />
            <Button type="primary" style={{ marginTop: 16 }}>
              Adicionar Serviço
            </Button>
          </div>
        </TabPane> */}

        {/* Relatórios */}
        {/* <TabPane tab="Relatórios" key="relatorios">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Empty description="Relatórios em desenvolvimento" />
          </div>
        </TabPane> */}
      </Tabs>
    </div>
  );
};

export default EmpresaDetalhes;
