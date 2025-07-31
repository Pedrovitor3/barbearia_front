import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Space,
  Divider,
  Typography,
  Card,
  Tag,
} from 'antd';
import {
  UserOutlined,
  ScissorOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Servico } from '../../interfaces/ServicoInterface';
import type { FormValues } from '../../interfaces/FormData';
import type { AgendamentoInterface } from '../../interfaces/AgendamentoInterface';

const { Text } = Typography;
const { Option } = Select;

interface AgendamentoModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: AgendamentoInterface) => void;
  barbearia?: string;
}

interface ResumoCalculado {
  servicos_info: Servico[];
  precoTotal: number;
  duracaoTotal: number;
}

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  barbearia = 'Barbearia do Jô',
}) => {
  const [form] = Form.useForm<FormValues>();

  // Dados fictícios dos serviços
  const servicos: Servico[] = [
    {
      id: 'corte',
      nome: 'Corte de Cabelo',
      preco: 25.0,
      duracao: 30,
      descricao: 'Corte masculino tradicional',
    },
    {
      id: 'barba',
      nome: 'Barba',
      preco: 15.0,
      duracao: 20,
      descricao: 'Aparar e modelar barba',
    },
    {
      id: 'corte-barba',
      nome: 'Corte + Barba',
      preco: 35.0,
      duracao: 45,
      descricao: 'Pacote completo',
    },
    {
      id: 'sobrancelha',
      nome: 'Sobrancelha',
      preco: 10.0,
      duracao: 15,
      descricao: 'Design de sobrancelha masculina',
    },
    {
      id: 'lavagem',
      nome: 'Lavagem + Hidratação',
      preco: 20.0,
      duracao: 25,
      descricao: 'Lavagem e tratamento capilar',
    },
  ];

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();

      // Calcular preço total e duração total
      const servicosSelecionados = values.servicos
        .map((id: string) => servicos.find(s => s.id === id))
        .filter((servico): servico is Servico => servico !== undefined);

      const precoTotal = servicosSelecionados.reduce(
        (total: number, servico: Servico) => total + servico.preco,
        0
      );

      const duracaoTotal = servicosSelecionados.reduce(
        (total: number, servico: Servico) => total + servico.duracao,
        0
      );

      const agendamento: AgendamentoInterface = {
        ...values,
        barbearia,
        servicosSelecionados,
        precoTotal,
        duracaoTotal,
        data: values.data.format('YYYY-MM-DD'),
        horario: values.horario.format('HH:mm'),
      };

      onConfirm(agendamento);
      form.resetFields();
    } catch (error) {
      console.error('Erro na validação:', error);
    }
  };

  const handleCancel = (): void => {
    form.resetFields();
    onCancel();
  };

  const calcularResumo = (): ResumoCalculado => {
    const servicosSelecionados = form.getFieldValue('servicos') || [];
    const servicos_info: Servico[] = (servicosSelecionados as string[])
      .map((id: string): Servico | undefined =>
        servicos.find((s: Servico) => s.id === id)
      )
      .filter(
        (servico: Servico | undefined): servico is Servico =>
          servico !== undefined
      );

    const precoTotal = servicos_info.reduce(
      (total: number, servico: Servico) => total + servico.preco,
      0
    );

    const duracaoTotal = servicos_info.reduce(
      (total: number, servico: Servico) => total + servico.duracao,
      0
    );

    return { servicos_info, precoTotal, duracaoTotal };
  };

  const { servicos_info, precoTotal, duracaoTotal } = calcularResumo();

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          <span>Novo Agendamento</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Confirmar Agendamento
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">Agendamento para: </Text>
        <Text strong>{barbearia}</Text>
      </div>

      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="cliente"
          label={
            <Space>
              <UserOutlined />
              <span>Nome do Cliente</span>
            </Space>
          }
          rules={[
            { required: true, message: 'Por favor, informe o nome do cliente' },
            { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
          ]}
        >
          <Input placeholder="Digite o nome completo do cliente" size="large" />
        </Form.Item>

        <Form.Item name="telefone" label="Telefone (opcional)">
          <Input placeholder="(62) 99999-9999" size="large" />
        </Form.Item>

        <Form.Item
          name="servicos"
          label={
            <Space>
              <ScissorOutlined />
              <span>Serviços</span>
            </Space>
          }
          rules={[
            { required: true, message: 'Selecione pelo menos um serviço' },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Selecione os serviços desejados"
            size="large"
            onChange={() => form.setFieldsValue({})} // Para atualizar o resumo
          >
            {servicos.map(servico => (
              <Option key={servico.id} value={servico.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{servico.nome}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {servico.descricao} • {servico.duracao}min
                    </div>
                  </div>
                  <Tag color="blue">R$ {servico.preco.toFixed(2)}</Tag>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="data"
            label={
              <Space>
                <CalendarOutlined />
                <span>Data</span>
              </Space>
            }
            rules={[{ required: true, message: 'Selecione a data' }]}
            style={{ flex: 1 }}
          >
            <DatePicker
              placeholder="Selecione a data"
              size="large"
              style={{ width: '100%' }}
              disabledDate={current =>
                current && current < dayjs().startOf('day')
              }
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="horario"
            label={
              <Space>
                <ClockCircleOutlined />
                <span>Horário</span>
              </Space>
            }
            rules={[{ required: true, message: 'Selecione o horário' }]}
            style={{ flex: 1 }}
          >
            <TimePicker
              placeholder="Selecione o horário"
              size="large"
              style={{ width: '100%' }}
              format="HH:mm"
              minuteStep={30}
              showNow={false}
            />
          </Form.Item>
        </div>

        <Form.Item name="observacoes" label="Observações (opcional)">
          <Input.TextArea
            rows={3}
            placeholder="Alguma observação especial sobre o atendimento..."
          />
        </Form.Item>
      </Form>

      {servicos_info.length > 0 && (
        <>
          <Divider />
          <Card
            size="small"
            title={
              <Space>
                <DollarOutlined />
                <span>Resumo do Agendamento</span>
              </Space>
            }
          >
            <div style={{ marginBottom: 12 }}>
              <Text strong>Serviços selecionados:</Text>
              <div style={{ marginTop: 8 }}>
                {servicos_info.map((servico: Servico) => (
                  <Tag
                    key={servico.id}
                    color="processing"
                    style={{ marginBottom: 4 }}
                  >
                    {servico.nome} - R$ {servico.preco.toFixed(2)}
                  </Tag>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Text>Duração total:</Text>
              <Text strong>{duracaoTotal} minutos</Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Valor total:</Text>
              <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                R$ {precoTotal.toFixed(2)}
              </Text>
            </div>
          </Card>
        </>
      )}
    </Modal>
  );
};

export default AgendamentoModal;
