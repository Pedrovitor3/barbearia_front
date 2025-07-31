import { PlusOutlined } from '@ant-design/icons';
import { Flex, Button, message, type UploadFile } from 'antd';
import { useState } from 'react';
import barbeariaJoImg from '../../assets/BarbeariaImagens/barbeariaJo.png';
import './index.css';
import BarbeariaCard from '../../components/Card/BarbeariaCard';
import ModalBarbearia from '../../components/Modal/BarbeariaModal';

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

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBarbearia, setSelectedBarbearia] = useState<Barbearia | null>(
    null
  );

  const [barbearias, setBarbearias] = useState<Barbearia[]>([
    {
      id: 'jo',
      title: 'Barbearia do Jô',
      bairro: 'Cidade Jardim',
      cidade: 'Goiânia',
      image: barbeariaJoImg,
      descricao: 'Barbearia tradicional com mais de 20 anos de experiência',
      barbeiros: ['João', 'Carlos'],
      telefone: '(62) 99999-9999',
      horarioFuncionamento: '08:00 - 18:00',
      preco: 25,
    },
    {
      id: 'ze',
      title: 'Barbearia do Zé',
      bairro: 'Centro',
      cidade: 'Goiânia',
      image: barbeariaJoImg,
      descricao: 'Cortes modernos e clássicos no coração da cidade',
      barbeiros: ['José', 'Pedro'],
      telefone: '(62) 88888-8888',
      horarioFuncionamento: '09:00 - 19:00',
      preco: 30,
    },
    {
      id: 'rei',
      title: 'Rei da Navalha',
      bairro: 'Jardim América',
      cidade: 'Goiânia',
      image: barbeariaJoImg,
      descricao: 'Especialistas em barba e bigode',
      barbeiros: ['Roberto', 'Marcos'],
      telefone: '(62) 77777-7777',
      horarioFuncionamento: '08:30 - 18:30',
      preco: 35,
    },
    {
      id: 'elite',
      title: 'Elite Barber',
      bairro: 'Setor Sul',
      cidade: 'Goiânia',
      image: barbeariaJoImg,
      descricao: 'Barbearia premium com atendimento VIP',
      barbeiros: ['Anderson', 'Felipe'],
      telefone: '(62) 66666-6666',
      horarioFuncionamento: '10:00 - 20:00',
      preco: 50,
    },
    {
      id: 'central',
      title: 'Barbearia Central',
      bairro: 'Vila Nova',
      cidade: 'Goiânia',
      image: barbeariaJoImg,
      descricao: 'Tradição familiar há 3 gerações',
      barbeiros: ['Antonio', 'Francisco'],
      telefone: '(62) 55555-5555',
      horarioFuncionamento: '07:00 - 17:00',
      preco: 20,
    },
    {
      id: 'dois',
      title: 'Dois Irmãos Barber',
      bairro: 'Morada do Sol',
      cidade: 'Goiânia',
      image: barbeariaJoImg,
      descricao: 'Irmãos unidos pela paixão em cortar cabelo',
      barbeiros: ['Lucas', 'Mateus'],
      telefone: '(62) 44444-4444',
      horarioFuncionamento: '08:00 - 18:00',
      preco: 28,
    },
  ]);

  const handleOpenBarbearia = (id: string) => {
    console.log('barbearia id', id);
    // Aqui você pode implementar navegação para página de detalhes
  };

  const handleSettingsClick = (id: string) => {
    const barbearia = barbearias.find(b => b.id === id);
    if (barbearia) {
      setSelectedBarbearia(barbearia);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleMoreOptionsClick = (id: string) => {
    console.log('Mais opções', id);
    // Aqui você pode implementar um dropdown com mais opções
    // como excluir, duplicar, etc.
  };

  const handleOpenCreateModal = () => {
    setSelectedBarbearia(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedBarbearia(null);
  };

  const handleSubmitBarbearia = async (id: string, data: BarbeariaFormData) => {
    try {
      setLoading(true);

      // Simular delay de API (remover em produção)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isEditing && id) {
        // Atualizar barbearia existente
        const barbeariaAtualizada: Barbearia = {
          id,
          title: data.nome,
          descricao: data.descricao,
          bairro: data.bairro,
          cidade: data.cidade,
          image:
            data.imagem?.[0]?.url ||
            data.imagem?.[0]?.thumbUrl ||
            selectedBarbearia?.image ||
            barbeariaJoImg,
          barbeiros: data.barbeiros || [],
          telefone: data.telefone,
          horarioFuncionamento: data.horarioFuncionamento,
          preco: data.preco,
        };

        setBarbearias(prev =>
          prev.map(barbearia =>
            barbearia.id === id ? barbeariaAtualizada : barbearia
          )
        );

        message.success('Barbearia atualizada com sucesso!');
      } else {
        // Criar nova barbearia
        const newId = Date.now().toString();
        const novaBarbearia: Barbearia = {
          id: newId,
          title: data.nome,
          descricao: data.descricao,
          bairro: data.bairro,
          cidade: data.cidade,
          image: data.imagem?.[0]?.thumbUrl || barbeariaJoImg,
          barbeiros: data.barbeiros || [],
          telefone: data.telefone,
          horarioFuncionamento: data.horarioFuncionamento,
          preco: data.preco,
        };

        setBarbearias(prev => [...prev, novaBarbearia]);
        message.success('Barbearia criada com sucesso!');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar barbearia:', error);
      message.error('Erro ao salvar barbearia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header com botão de criar */}
      <div
        style={{
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            Barbearias
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            {barbearias.length} barbearia{barbearias.length !== 1 ? 's' : ''}{' '}
            encontrada{barbearias.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreateModal}
          size="large"
        >
          Nova Barbearia
        </Button>
      </div>

      {/* Cards das barbearias */}
      <Flex wrap gap="middle" justify="start">
        {barbearias.map(barbearia => (
          <BarbeariaCard
            key={barbearia.id}
            barbearia={barbearia}
            onCardClick={handleOpenBarbearia}
            onSettingsClick={handleSettingsClick}
            onMoreOptionsClick={handleMoreOptionsClick}
          />
        ))}
      </Flex>

      {/* Modal unificado para criar/editar */}
      <ModalBarbearia
        open={isModalOpen}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitBarbearia}
        loading={loading}
        barbearia={selectedBarbearia}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Home;
