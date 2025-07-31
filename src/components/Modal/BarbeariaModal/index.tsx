import { UploadOutlined } from '@ant-design/icons';
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Select,
  InputNumber,
  Flex,
  message,
} from 'antd';
import { useEffect } from 'react';
import { type RcFile, type UploadFile } from 'antd/es/upload';

interface Barbearia {
  id: string;
  title: string;
  bairro: string;
  cidade: string;
  image: string;
  descricao: string;
  barbeiros: string[];
  telefone: string;
  horarioFuncionamento: string;
  preco: number;
}

interface BarbeariaFormData {
  nome: string;
  descricao: string;
  bairro: string;
  cidade: string;
  telefone: string;
  horarioFuncionamento: string;
  preco: number;
  barbeiros?: string[];
  imagem?: UploadFile[];
}

interface ModalBarbeariaProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (id: string, data: BarbeariaFormData) => void;
  loading?: boolean;
  barbearia?: Barbearia | null;
  isEditing?: boolean;
}

const ModalBarbearia: React.FC<ModalBarbeariaProps> = ({
  open,
  onCancel,
  onSubmit,
  loading = false,
  barbearia = null,
  isEditing = false,
}) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  // Preencher form quando modal abre para edição
  useEffect(() => {
    if (open && isEditing && barbearia) {
      form.setFieldsValue({
        nome: barbearia.title,
        descricao: barbearia.descricao,
        bairro: barbearia.bairro,
        cidade: barbearia.cidade,
        telefone: barbearia.telefone,
        horarioFuncionamento: barbearia.horarioFuncionamento,
        preco: barbearia.preco,
        barbeiros: barbearia.barbeiros,
        // Para imagem, você pode criar um UploadFile mock se necessário
        imagem: barbearia.image
          ? [
              {
                uid: '-1',
                name: 'imagem-atual.jpg',
                status: 'done',
                url: barbearia.image,
              },
            ]
          : [],
      });
    } else if (!open || !isEditing) {
      form.resetFields();
    }
  }, [open, isEditing, barbearia, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && barbearia) {
        onSubmit(barbearia.id, values);
      } else {
        onSubmit('', values); // Para criação, ID será gerado no componente pai
      }
    } catch (error) {
      console.error('Erro na validação:', error);
    }
  };

  const uploadProps = {
    beforeUpload: (file: RcFile) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Você só pode fazer upload de arquivos JPG/PNG!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('A imagem deve ser menor que 2MB!');
      }
      return false; // Prevent upload for now
    },
    maxCount: 1,
  };

  const modalTitle = isEditing
    ? 'Editar Barbearia'
    : 'Cadastrar Nova Barbearia';
  const buttonText = isEditing ? 'Salvar Alterações' : 'Cadastrar Barbearia';

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      width={600}
      confirmLoading={loading}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {buttonText}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="nome"
          label="Nome da Barbearia"
          rules={[
            {
              required: true,
              message: 'Por favor, insira o nome da barbearia!',
            },
          ]}
        >
          <Input placeholder="Ex: Barbearia do João" />
        </Form.Item>

        <Form.Item
          name="descricao"
          label="Descrição"
          rules={[
            { required: true, message: 'Por favor, insira uma descrição!' },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Descreva sua barbearia, especialidades, diferenciais..."
          />
        </Form.Item>

        <Flex gap="middle">
          <Form.Item
            name="bairro"
            label="Bairro"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Por favor, insira o bairro!' }]}
          >
            <Input placeholder="Ex: Centro" />
          </Form.Item>

          <Form.Item
            name="cidade"
            label="Cidade"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Por favor, insira a cidade!' }]}
          >
            <Input placeholder="Ex: Goiânia" />
          </Form.Item>
        </Flex>

        <Form.Item
          name="telefone"
          label="Telefone"
          rules={[
            { required: true, message: 'Por favor, insira o telefone!' },
            {
              pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
              message: 'Formato: (62) 99999-9999',
            },
          ]}
        >
          <Input placeholder="(62) 99999-9999" />
        </Form.Item>

        <Flex gap="middle">
          <Form.Item
            name="horarioFuncionamento"
            label="Horário de Funcionamento"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Por favor, insira o horário!' },
            ]}
          >
            <Input placeholder="Ex: 08:00 - 18:00" />
          </Form.Item>

          <Form.Item
            name="preco"
            label="Preço a partir de (R$)"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Por favor, insira o preço!' },
              {
                type: 'number',
                min: 0,
                message: 'O preço deve ser maior que zero!',
              },
            ]}
          >
            <InputNumber<number>
              min={0}
              precision={2}
              placeholder="25.00"
              style={{ width: '100%' }}
              formatter={value =>
                `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value =>
                parseFloat(value!.replace(/R\$\s?|(,)/g, '')) || 0
              }
            />
          </Form.Item>
        </Flex>

        <Form.Item
          name="barbeiros"
          label="Barbeiros"
          tooltip="Digite o nome do barbeiro e pressione Enter para adicionar"
        >
          <Select
            mode="tags"
            placeholder="Digite os nomes dos barbeiros e pressione Enter"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item
          name="imagem"
          label="Imagem da Barbearia"
          tooltip="Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB"
        >
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>
              {isEditing ? 'Alterar Imagem' : 'Selecionar Imagem'}
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalBarbearia;
