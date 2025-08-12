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
import type {
  EmpresaFormData,
  EmpresaInterface,
} from '../../../interfaces/EmpresaInterface';

interface ModalBarbeariaProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (id: number, data: EmpresaFormData) => void;
  loading?: boolean;
  empresa?: EmpresaInterface | null;
  isEditing?: boolean;
}

const ModalBarbearia: React.FC<ModalBarbeariaProps> = ({
  open,
  onCancel,
  onSubmit,
  loading = false,
  empresa = null,
  isEditing = false,
}) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  // No useEffect para preencher o form:
  useEffect(() => {
    if (open && isEditing && empresa) {
      form.setFieldsValue({
        nomeFantasia: empresa.nomeFantasia,
        slug: empresa.slug,
        razaoSocial: empresa.razaoSocial,
        cnpj: empresa.cnpj,
      });
    } else if (!open || !isEditing) {
      form.resetFields();
    }
  }, [open, isEditing, empresa, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && empresa) {
        onSubmit(empresa.empresaId, values);
      } else {
        onSubmit(-1, values); // Para criação, ID será gerado no componente pai
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

  const modalTitle = isEditing ? 'Editar Empresa' : 'Cadastrar Nova Empresa';
  const buttonText = isEditing ? 'Salvar Alterações' : 'Cadastrar Empresa';

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
          name="nomeFantasia"
          label="Nome Fantasia"
          rules={[
            { required: true, message: 'Por favor, insira o nome fantasia!' },
          ]}
        >
          <Input placeholder="Ex: Salão do João" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: 'Por favor, insira o slug!' }]}
        >
          <Input placeholder="Ex: salao-do-joao" />
        </Form.Item>

        <Form.Item
          name="razaoSocial"
          label="Razão Social"
          rules={[
            { required: true, message: 'Por favor, insira a razão social!' },
          ]}
        >
          <Input placeholder="Ex: Salão do João LTDA" />
        </Form.Item>

        <Form.Item
          name="cnpj"
          label="CNPJ"
          rules={[
            { required: true, message: 'Por favor, insira o CNPJ!' },
            {
              pattern: /^\d{14}$/,
              message: 'CNPJ deve conter 14 dígitos (apenas números)!',
            },
          ]}
        >
          <Input placeholder="00000000000002" maxLength={14} />
        </Form.Item>
        {/* <Form.Item
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
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ModalBarbearia;
