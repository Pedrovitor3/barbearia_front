import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  TimePicker,
} from 'antd';
import type { AgendamentoFormData } from '../../../interfaces/AgendamentoInterface';
import dayjs from 'dayjs';

interface AgendamentoModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AgendamentoFormData) => Promise<void>;
  loading?: boolean;
  // Dados para os selects - você deve passar estes dados do componente pai
  clientes?: Array<{ id: number; nome: string }>;
  funcionarios?: Array<{ id: number; nome: string }>;
  servicos?: Array<{ id: number; nome: string; preco?: number }>;
}
const { Option } = Select;
const { TextArea } = Input;

const AgendamentoModal: React.FC<AgendamentoModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  clientes = [],
  funcionarios = [],
  servicos = [],
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Formatando os dados antes de enviar
      const formData: AgendamentoFormData = {
        ...values,
        dataAgendamento: values.dataAgendamento.toDate(),
        horarioInicio: values.horarioInicio.format('HH:mm'),
        horarioFim: values.horarioFim.format('HH:mm'),
      };

      await onSubmit(formData);
      form.resetFields();
      message.success('Agendamento criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      message.error('Erro ao criar agendamento');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Quando um serviço é selecionado, preencher automaticamente o valor
  const handleServicoChange = (servicoId: number) => {
    const servico = servicos.find(s => s.id === servicoId);
    if (servico && servico.preco) {
      form.setFieldsValue({ valor: servico.preco });
    }
  };

  // Calcular horário de fim baseado no início + duração estimada
  const handleHorarioInicioChange = (time: dayjs.Dayjs | null) => {
    if (time) {
      // Assumindo 1 hora de duração padrão, você pode ajustar conforme necessário
      const horarioFim = time.add(1, 'hour');
      form.setFieldsValue({ horarioFim });
    }
  };

  return (
    <Modal
      title="Novo Agendamento"
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Salvar Agendamento
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Space.Compact style={{ display: 'flex', width: '100%' }}>
          <Form.Item
            name="clienteId"
            label="Cliente"
            style={{ flex: 1, marginRight: 8 }}
            rules={[{ required: true, message: 'Selecione um cliente' }]}
          >
            <Select placeholder="Selecione um cliente" showSearch>
              {clientes.map(cliente => (
                <Option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="funcionarioId"
            label="Funcionário"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Selecione um funcionário' }]}
          >
            <Select placeholder="Selecione um funcionário">
              {funcionarios.map(funcionario => (
                <Option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Space.Compact>

        <Form.Item
          name="servicoId"
          label="Serviço"
          rules={[{ required: true, message: 'Selecione um serviço' }]}
        >
          <Select
            placeholder="Selecione um serviço"
            onChange={handleServicoChange}
          >
            {servicos.map(servico => (
              <Option key={servico.id} value={servico.id}>
                {servico.nome} {servico.preco && `- R$ ${servico.preco}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dataAgendamento"
          label="Data do Agendamento"
          rules={[{ required: true, message: 'Selecione uma data' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            placeholder="Selecione a data"
            disabledDate={current =>
              current && current < dayjs().startOf('day')
            }
          />
        </Form.Item>

        <Space.Compact style={{ display: 'flex', width: '100%' }}>
          <Form.Item
            name="horarioInicio"
            label="Horário Início"
            style={{ flex: 1, marginRight: 8 }}
            rules={[
              { required: true, message: 'Selecione o horário de início' },
            ]}
          >
            <TimePicker
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="00:00"
              onChange={handleHorarioInicioChange}
            />
          </Form.Item>

          <Form.Item
            name="horarioFim"
            label="Horário Fim"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Selecione o horário de fim' }]}
          >
            <TimePicker
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="00:00"
            />
          </Form.Item>
        </Space.Compact>

        <Form.Item name="valor" label="Valor (R$)">
          <InputNumber
            style={{ width: '100%' }}
            placeholder="0,00"
            min={0}
            precision={2}
            formatter={value =>
              `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
            parser={value =>
              (parseFloat(
                value?.replace(/R\$\s?|(\.)/g, '').replace(',', '.') || '0'
              ) || 0) as 0
            }
          />
        </Form.Item>

        <Form.Item name="observacoes" label="Observações">
          <TextArea
            rows={3}
            placeholder="Digite observações adicionais sobre o agendamento..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AgendamentoModal;
