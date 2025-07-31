import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  Select,
  Row,
  Col,
  Typography,
  Divider,
  message,
  Space,
  Tag,
  Switch,
  TimePicker,
  Checkbox,
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  EditOutlined,
  SaveOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';
import type { RcFile } from 'antd/es/upload';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PerfilData {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  nivel: 'admin' | 'barbeiro' | 'cliente';
  foto?: string;
  dataNascimento: string;
  dataAdmissao?: string;
  especialidades?: string[];
  horarioTrabalho?: {
    entrada: string;
    saida: string;
    diasSemana: string[];
  };
  ativo: boolean;
  bio?: string;
}

const Perfil = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Dados fictícios do usuário logado
  const [perfilData, setPerfilData] = useState<PerfilData>({
    id: '1',
    nome: 'João Carlos Silva',
    cpf: '123.456.789-00',
    email: 'joao.silva@barbearia.com',
    telefone: '(62) 99999-9999',
    endereco: 'Rua das Flores, 123 - Cidade Jardim, Goiânia-GO',
    nivel: 'barbeiro', // Pode ser 'admin', 'barbeiro' ou 'cliente'
    foto: '',
    dataNascimento: '1985-05-15',
    dataAdmissao: '2020-03-10',
    especialidades: ['Corte Masculino', 'Barba', 'Bigode'],
    horarioTrabalho: {
      entrada: '08:00',
      saida: '18:00',
      diasSemana: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
    },
    ativo: true,
    bio: 'Barbeiro profissional com mais de 10 anos de experiência. Especialista em cortes modernos e tradicionais.',
  });

  const especialidadesDisponiveis = [
    'Corte Masculino',
    'Corte Feminino',
    'Barba',
    'Bigode',
    'Sobrancelha',
    'Tratamento Capilar',
    'Coloração',
    'Penteados',
  ];

  const diasSemana = [
    { label: 'Segunda', value: 'segunda' },
    { label: 'Terça', value: 'terca' },
    { label: 'Quarta', value: 'quarta' },
    { label: 'Quinta', value: 'quinta' },
    { label: 'Sexta', value: 'sexta' },
    { label: 'Sábado', value: 'sabado' },
    { label: 'Domingo', value: 'domingo' },
  ];

  const handleUpload: UploadProps['customRequest'] = options => {
    const { file, onSuccess } = options;
    // Simular upload da foto
    setTimeout(() => {
      message.success('Foto atualizada com sucesso!');
      onSuccess?.({}, file as RcFile);
    }, 1000);
  };

  const handleSave = async (values: Partial<PerfilData>) => {
    setLoading(true);
    try {
      // Simular salvamento dos dados
      setTimeout(() => {
        setPerfilData(prev => ({ ...prev, ...values }));
        setEditMode(false);
        setLoading(false);
        message.success('Perfil atualizado com sucesso!');
      }, 1000);
    } catch {
      setLoading(false);
      message.error('Erro ao atualizar perfil');
    }
  };

  const getNivelTag = (nivel: string) => {
    const nivelConfig = {
      admin: { color: 'red', text: 'Administrador' },
      barbeiro: { color: 'blue', text: 'Barbeiro' },
      cliente: { color: 'green', text: 'Cliente' },
    };
    const config = nivelConfig[nivel as keyof typeof nivelConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const renderModoVisualizacao = () => (
    <Row gutter={[24, 24]}>
      {/* Informações Básicas */}
      <Col xs={24} lg={8}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={perfilData.foto}
              style={{ marginBottom: '16px' }}
            />
            <Title level={3} style={{ margin: '8px 0' }}>
              {perfilData.nome}
            </Title>
            {getNivelTag(perfilData.nivel)}
            <div style={{ marginTop: '8px' }}>
              <Switch
                checked={perfilData.ativo}
                checkedChildren="Ativo"
                unCheckedChildren="Inativo"
                disabled
              />
            </div>
          </div>

          {perfilData.bio && (
            <div>
              <Text strong>Biografia:</Text>
              <Text
                type="secondary"
                style={{ display: 'block', marginTop: '4px' }}
              >
                {perfilData.bio}
              </Text>
            </div>
          )}
        </Card>
      </Col>

      {/* Dados Pessoais */}
      <Col xs={24} lg={8}>
        <Card title="Dados Pessoais">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>
                <IdcardOutlined /> CPF:
              </Text>
              <br />
              <Text>{perfilData.cpf}</Text>
            </div>
            <div>
              <Text strong>
                <MailOutlined /> Email:
              </Text>
              <br />
              <Text>{perfilData.email}</Text>
            </div>
            <div>
              <Text strong>
                <PhoneOutlined /> Telefone:
              </Text>
              <br />
              <Text>{perfilData.telefone}</Text>
            </div>
            <div>
              <Text strong>
                <HomeOutlined /> Endereço:
              </Text>
              <br />
              <Text>{perfilData.endereco}</Text>
            </div>
            <div>
              <Text strong>
                <CalendarOutlined /> Data de Nascimento:
              </Text>
              <br />
              <Text>
                {dayjs(perfilData.dataNascimento).format('DD/MM/YYYY')}
              </Text>
            </div>
            {perfilData.dataAdmissao && (
              <div>
                <Text strong>Data de Admissão:</Text>
                <br />
                <Text>
                  {dayjs(perfilData.dataAdmissao).format('DD/MM/YYYY')}
                </Text>
              </div>
            )}
          </Space>
        </Card>
      </Col>

      {/* Informações Profissionais (apenas para barbeiros) */}
      {perfilData.nivel === 'barbeiro' && (
        <Col xs={24} lg={8}>
          <Card title="Informações Profissionais">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Especialidades:</Text>
                <div style={{ marginTop: '8px' }}>
                  {perfilData.especialidades?.map(esp => (
                    <Tag key={esp} style={{ margin: '2px' }}>
                      {esp}
                    </Tag>
                  ))}
                </div>
              </div>

              {perfilData.horarioTrabalho && (
                <div>
                  <Text strong>
                    <ClockCircleOutlined /> Horário de Trabalho:
                  </Text>
                  <br />
                  <Text>
                    {perfilData.horarioTrabalho.entrada} às{' '}
                    {perfilData.horarioTrabalho.saida}
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    {perfilData.horarioTrabalho.diasSemana.map(dia => (
                      <Tag key={dia} style={{ margin: '2px' }}>
                        {dia}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </Space>
          </Card>
        </Col>
      )}
    </Row>
  );

  const renderModoEdicao = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...perfilData,
        dataNascimento: dayjs(perfilData.dataNascimento),
        dataAdmissao: perfilData.dataAdmissao
          ? dayjs(perfilData.dataAdmissao)
          : undefined,
        horarioEntrada: perfilData.horarioTrabalho?.entrada
          ? dayjs(perfilData.horarioTrabalho.entrada, 'HH:mm')
          : undefined,
        horarioSaida: perfilData.horarioTrabalho?.saida
          ? dayjs(perfilData.horarioTrabalho.saida, 'HH:mm')
          : undefined,
        diasSemana: perfilData.horarioTrabalho?.diasSemana || [],
      }}
      onFinish={handleSave}
    >
      <Row gutter={[24, 24]}>
        {/* Foto e Informações Básicas */}
        <Col xs={24} lg={8}>
          <Card title="Foto do Perfil">
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={perfilData.foto}
                style={{ marginBottom: '16px' }}
              />
              <Upload
                showUploadList={false}
                customRequest={handleUpload}
                accept="image/*"
              >
                <Button icon={<CameraOutlined />}>Alterar Foto</Button>
              </Upload>
            </div>

            <Divider />

            <Form.Item
              name="nome"
              label="Nome Completo"
              rules={[{ required: true, message: 'Nome é obrigatório' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="bio" label="Biografia">
              <TextArea rows={4} placeholder="Fale um pouco sobre você..." />
            </Form.Item>

            <Form.Item name="ativo" label="Status" valuePropName="checked">
              <Switch checkedChildren="Ativo" unCheckedChildren="Inativo" />
            </Form.Item>
          </Card>
        </Col>

        {/* Dados Pessoais */}
        <Col xs={24} lg={8}>
          <Card title="Dados Pessoais">
            <Form.Item
              name="cpf"
              label="CPF"
              rules={[{ required: true, message: 'CPF é obrigatório' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email é obrigatório' },
                { type: 'email', message: 'Email inválido' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="telefone"
              label="Telefone"
              rules={[{ required: true, message: 'Telefone é obrigatório' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="endereco" label="Endereço">
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item name="dataNascimento" label="Data de Nascimento">
              <Input type="date" />
            </Form.Item>

            {(perfilData.nivel === 'barbeiro' ||
              perfilData.nivel === 'admin') && (
              <Form.Item name="dataAdmissao" label="Data de Admissão">
                <Input type="date" />
              </Form.Item>
            )}
          </Card>
        </Col>

        {/* Informações Profissionais */}
        {perfilData.nivel === 'barbeiro' && (
          <Col xs={24} lg={8}>
            <Card title="Informações Profissionais">
              <Form.Item name="especialidades" label="Especialidades">
                <Select
                  mode="multiple"
                  placeholder="Selecione as especialidades"
                  options={especialidadesDisponiveis.map(esp => ({
                    label: esp,
                    value: esp,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Horário de Trabalho">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="horarioEntrada" label="Entrada">
                      <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="horarioSaida" label="Saída">
                      <TimePicker format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item name="diasSemana" label="Dias de Trabalho">
                <Checkbox.Group options={diasSemana} />
              </Form.Item>
            </Card>
          </Col>
        )}
      </Row>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Space>
          <Button onClick={() => setEditMode(false)}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Salvar Alterações
          </Button>
        </Space>
      </div>
    </Form>
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Meu Perfil
          </Title>
          <Text type="secondary">
            Gerencie suas informações pessoais e profissionais
          </Text>
        </div>

        {!editMode && (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditMode(true)}
          >
            Editar Perfil
          </Button>
        )}
      </div>

      {editMode ? renderModoEdicao() : renderModoVisualizacao()}

      {/* Seção de Alteração de Senha */}
      {!editMode && (
        <Card
          title="Segurança"
          style={{ marginTop: '24px' }}
          extra={
            <Button icon={<LockOutlined />} type="link">
              Alterar Senha
            </Button>
          }
        >
          <Text type="secondary">
            Mantenha sua conta segura alterando sua senha regularmente.
          </Text>
        </Card>
      )}
    </div>
  );
};

export default Perfil;
