import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
} from 'antd';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import type {
  FuncionarioInterface,
  FuncionarioFormData,
} from '../../../interfaces/FuncionarioInterface';

const { Option } = Select;

interface FuncionarioModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (id: number, data: FuncionarioFormData) => Promise<void>;
  loading: boolean;
  funcionario: FuncionarioInterface | null;
  isEditing: boolean;
  empresaId?: number;
}

const FuncionarioModal: React.FC<FuncionarioModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading,
  funcionario,
  isEditing,
  empresaId = 1, // Default empresa ID
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (open) {
      if (funcionario) {
        // Preencher formulário para edição
        form.setFieldsValue({
          nome: funcionario.pessoa.nome,
          sobrenome: funcionario.pessoa.sobrenome,
          cpf: funcionario.pessoa.cpf,
          email: funcionario.pessoa.email,
          username: funcionario.pessoa.username,
          dataNascimento: dayjs(funcionario.pessoa.dataNascimento),
          sexo: funcionario.pessoa.sexo,
          cargo: funcionario.cargo,
          salario: funcionario.salario ? Number(funcionario.salario) : null,
          dataAdmissao: dayjs(funcionario.dataAdmissao),
          empresaId: funcionario.empresaId,
        });
      } else {
        // Limpar formulário para criação
        form.resetFields();
        form.setFieldsValue({
          empresaId: empresaId,
          dataAdmissao: dayjs(),
        });
      }
    }
  }, [open, isEditing, funcionario, form, empresaId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData: FuncionarioFormData = {
        nome: values.nome,
        sobrenome: values.sobrenome,
        cpf: values.cpf,
        email: values.email,
        username: values.username,
        dataNascimento: values.dataNascimento.format('YYYY-MM-DD'),
        sexo: values.sexo,
        cargo: values.cargo,
        salario: values.salario || null,
        dataAdmissao: values.dataAdmissao.format('YYYY-MM-DD'),
        empresaId: values.empresaId,
      };

      await onSubmit(funcionario?.funcionarioId || 0, formData);
    } catch (error) {
      console.error('Erro na validação do formulário:', error);
    }
  };

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const cpf = value.replace(/\D/g, '');

    // Aplica a máscara
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <Modal
      title={isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
      okText={isEditing ? 'Salvar' : 'Criar'}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nome"
              label="Nome"
              rules={[
                { required: true, message: 'Nome é obrigatório' },
                { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
              ]}
            >
              <Input placeholder="Digite o nome" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sobrenome"
              label="Sobrenome"
              rules={[
                { required: true, message: 'Sobrenome é obrigatório' },
                {
                  min: 2,
                  message: 'Sobrenome deve ter pelo menos 2 caracteres',
                },
              ]}
            >
              <Input placeholder="Digite o sobrenome" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email é obrigatório' },
                { type: 'email', message: 'Email deve ter um formato válido' },
              ]}
            >
              <Input placeholder="Digite o email" type="email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Nome de Usuário"
              rules={[
                {
                  min: 3,
                  message: 'Username deve ter pelo menos 3 caracteres',
                },
              ]}
            >
              <Input placeholder="Digite o nome de usuário (opcional)" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[
                { required: true, message: 'CPF é obrigatório' },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    const cpfLimpo = value.replace(/\D/g, '');
                    if (cpfLimpo.length !== 11) {
                      return Promise.reject(
                        new Error('CPF deve conter 11 dígitos')
                      );
                    }

                    // Aqui você pode adicionar validação de CPF válido se necessário
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder="000.000.000-00"
                maxLength={14} // Limita o input a 14 caracteres
                onChange={e => {
                  const formatted = formatCPF(e.target.value);
                  if (formatted.length <= 14) {
                    form.setFieldValue('cpf', formatted);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sexo"
              label="Sexo"
              rules={[{ required: true, message: 'Sexo é obrigatório' }]}
            >
              <Select placeholder="Selecione o sexo">
                <Option value="M">Masculino</Option>
                <Option value="F">Feminino</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dataNascimento"
              label="Data de Nascimento"
              rules={[
                { required: true, message: 'Data de nascimento é obrigatória' },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
                disabledDate={current =>
                  current && current > dayjs().subtract(16, 'years')
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cargo"
              label="Cargo"
              rules={[{ required: true, message: 'Cargo é obrigatório' }]}
            >
              <Select placeholder="Selecione o cargo">
                <Option value="dono">Dono</Option>
                <Option value="gerente">Gerente</Option>
                <Option value="barbeiro">Barbeiro</Option>
                <Option value="atendente">Atendente</Option>
                <Option value="auxiliar">Auxiliar</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="salario" label="Salário">
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0,00"
                min={0}
                precision={2}
                formatter={value =>
                  `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dataAdmissao"
              label="Data de Admissão"
              rules={[
                { required: true, message: 'Data de admissão é obrigatória' },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Selecione a data"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="empresaId"
          label="Empresa ID"
          style={{ display: 'none' }}
        >
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FuncionarioModal;
