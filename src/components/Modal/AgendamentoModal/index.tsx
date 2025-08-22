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
import type { FuncionarioInterface } from '../../../interfaces/FuncionarioInterface';
import type { ClienteInterface } from '../../../interfaces/ClienteInterface';
import type { ServicoInterface } from '../../../interfaces/ServicoInterface';

interface AgendamentoModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: AgendamentoFormData) => Promise<void>;
  loading?: boolean;
  clientes?: ClienteInterface[];
  funcionarios?: FuncionarioInterface[];
  servicos?: ServicoInterface[];
  empresaId: number;
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
  empresaId,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log('Valores do formulário RAW:', values);

      // Validação mais rigorosa
      if (!values.dataAgendamento) {
        message.error('Selecione uma data');
        return;
      }

      if (!values.horarioInicio) {
        message.error('Selecione o horário de início');
        return;
      }

      if (!values.horarioFim) {
        message.error('Selecione o horário de fim');
        return;
      }

      let dataAgendamentoString: string;
      let horarioInicioFormatado: string;
      let horarioFimFormatado: string;

      try {
        const dataObj = dayjs.isDayjs(values.dataAgendamento)
          ? values.dataAgendamento
          : dayjs(values.dataAgendamento);

        const horarioInicioObj = dayjs.isDayjs(values.horarioInicio)
          ? values.horarioInicio
          : dayjs(values.horarioInicio);

        const horarioFimObj = dayjs.isDayjs(values.horarioFim)
          ? values.horarioFim
          : dayjs(values.horarioFim);

        if (!dataObj.isValid()) throw new Error('Data inválida');
        if (!horarioInicioObj.isValid())
          throw new Error('Horário de início inválido');
        if (!horarioFimObj.isValid())
          throw new Error('Horário de fim inválido');

        // Agora sim, string YYYY-MM-DD
        dataAgendamentoString = dataObj.format('YYYY-MM-DD');
        horarioInicioFormatado = horarioInicioObj.format('HH:mm');
        horarioFimFormatado = horarioFimObj.format('HH:mm');

        console.log('Data formatada:', dataAgendamentoString);
        console.log('Horário início formatado:', horarioInicioFormatado);
        console.log('Horário fim formatado:', horarioFimFormatado);
      } catch (error) {
        console.error('Erro ao formatar datas/horários:', error);
        message.error('Erro ao processar data ou horários');
        return;
      }

      // Montar dados finais - enviando como string YYYY-MM-DD
      const formData: AgendamentoFormData = {
        clienteId: Number(values.clienteId),
        funcionarioId: Number(values.funcionarioId),
        servicoId: Number(values.servicoId),
        dataAgendamento: dataAgendamentoString, // String ao invés de Date
        horarioInicio: horarioInicioFormatado,
        horarioFim: horarioFimFormatado,
        valor: values.valor ? Number(values.valor) : undefined,
        observacoes: values.observacoes || undefined,
        empresaId,
      };

      console.log('Dados finais para envio:', formData);

      await onSubmit(formData);
      form.resetFields();
      message.success('Agendamento criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);

      // Melhor tratamento de erro
      if (error?.response?.data?.message) {
        message.error(`Erro: ${error.response.data.message}`);
      } else if (error?.message) {
        message.error(`Erro: ${error.message}`);
      } else {
        message.error('Erro ao criar agendamento');
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Quando um serviço é selecionado, preencher automaticamente o valor
  const handleServicoChange = (servicoId: number) => {
    const servico = servicos.find(s => s.servicoId === servicoId);
    if (servico && servico.preco) {
      // Converter string para number se necessário
      const preco =
        typeof servico.preco === 'string'
          ? parseFloat(servico.preco)
          : servico.preco;
      form.setFieldsValue({ valor: preco });
    }
  };

  // Calcular horário de fim baseado no início + duração estimada
  const handleHorarioInicioChange = (time: dayjs.Dayjs | null) => {
    if (time && dayjs(time).isValid()) {
      // Assumindo 1 hora de duração padrão
      const horarioFim = dayjs(time).add(1, 'hour');
      form.setFieldsValue({ horarioFim });
    }
  };

  // Validação customizada para horários
  const validateHorarios = () => {
    const horarioInicio = form.getFieldValue('horarioInicio');
    const horarioFim = form.getFieldValue('horarioFim');

    if (horarioInicio && horarioFim) {
      const inicio = dayjs(horarioInicio);
      const fim = dayjs(horarioFim);

      if (inicio.isValid() && fim.isValid() && fim.isBefore(inicio)) {
        return Promise.reject(
          new Error('Horário de fim deve ser após o horário de início')
        );
      }
    }
    return Promise.resolve();
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
                <Option key={cliente.clienteId} value={cliente.clienteId}>
                  {cliente.pessoa?.nome || `Cliente ${cliente.clienteId}`}
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
                <Option
                  key={funcionario.funcionarioId}
                  value={funcionario.funcionarioId}
                >
                  {funcionario.pessoa?.nome ||
                    `Funcionário ${funcionario.funcionarioId}`}
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
              <Option key={servico.servicoId} value={servico.servicoId}>
                {servico.nome} {servico.preco && `- R$ ${servico.preco}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dataAgendamento"
          label="Data do Agendamento"
          rules={[
            { required: true, message: 'Selecione uma data' },
            {
              validator: (_, value) => {
                if (value && !dayjs(value).isValid()) {
                  return Promise.reject(new Error('Data inválida'));
                }
                return Promise.resolve();
              },
            },
          ]}
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
              {
                validator: (_, value) => {
                  if (value && !dayjs(value).isValid()) {
                    return Promise.reject(new Error('Horário inválido'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TimePicker
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="00:00"
              onChange={handleHorarioInicioChange}
              minuteStep={15} // Intervalos de 15 minutos
            />
          </Form.Item>

          <Form.Item
            name="horarioFim"
            label="Horário Fim"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Selecione o horário de fim' },
              {
                validator: (_, value) => {
                  if (value && !dayjs(value).isValid()) {
                    return Promise.reject(new Error('Horário inválido'));
                  }
                  return validateHorarios();
                },
              },
            ]}
          >
            <TimePicker
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="00:00"
              minuteStep={15} // Intervalos de 15 minutos
            />
          </Form.Item>
        </Space.Compact>

        <Form.Item
          name="valor"
          label="Valor (R$)"
          rules={[
            {
              validator: (_, value) => {
                if (value && (isNaN(value) || value < 0)) {
                  return Promise.reject(
                    new Error('Valor deve ser um número positivo')
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="0,00"
            min={0}
            precision={2}
            formatter={value =>
              `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
            // parser={value => {
            //   const parsed = parseFloat(
            //     value?.replace(/R\$\s?|(\.)/g, '').replace(',', '.') || '0'
            //   );
            //   return isNaN(parsed) ? 0 : parsed;
            // }}
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
