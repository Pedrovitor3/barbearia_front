import { Card, Avatar, Button, Typography, Tag, Tooltip } from 'antd';
import { UserOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import type { FuncionarioInterface } from '../../../interfaces/FuncionarioInterface';

const { Text, Title } = Typography;

interface FuncionarioCardProps {
  funcionario: FuncionarioInterface;
  onCardClick: (id: number) => void;
  onSettingsClick: (id: number) => void;
  onMoreOptionsClick: (id: number) => void;
}

const FuncionarioCard: React.FC<FuncionarioCardProps> = ({
  funcionario,
  onCardClick,
  onSettingsClick,
  onMoreOptionsClick,
}) => {
  const formatSalario = (salario: number | string | null) => {
    if (!salario) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(salario));
  };

  const formatData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getCargoColor = (cargo: string) => {
    switch (cargo.toLowerCase()) {
      case 'dono':
        return 'gold';
      case 'gerente':
        return 'blue';
      case 'barbeiro':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Card
      hoverable
      style={{
        width: 300,
        marginBottom: 16,
        cursor: 'pointer',
      }}
      onClick={() => onCardClick(funcionario.funcionarioId)}
      actions={[
        <Tooltip title="Editar">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={e => {
              e.stopPropagation();
              onSettingsClick(funcionario.funcionarioId);
            }}
          />
        </Tooltip>,
        <Tooltip title="Mais opções">
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={e => {
              e.stopPropagation();
              onMoreOptionsClick(funcionario.funcionarioId);
            }}
          />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar size={64} icon={<UserOutlined />} />}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Title level={4} style={{ margin: 0 }}>
              {funcionario?.pessoa?.nome} {funcionario?.pessoa?.sobrenome}
            </Title>
            {!funcionario.ativo && <Tag color="red">Inativo</Tag>}
          </div>
        }
        description={
          <div style={{ marginTop: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <Tag color={getCargoColor(funcionario.cargo)}>
                {funcionario.cargo.toUpperCase()}
              </Tag>
            </div>

            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">Email: </Text>
              <Text>{funcionario.pessoa?.username}</Text>
            </div>

            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">CPF: </Text>
              <Text>{funcionario.pessoa?.cpf}</Text>
            </div>

            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">Salário: </Text>
              <Text strong>{formatSalario(funcionario.salario)}</Text>
            </div>

            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">Admissão: </Text>
              <Text>{formatData(funcionario.dataAdmissao)}</Text>
            </div>

            {funcionario.dataDemissao && (
              <div style={{ marginBottom: 4 }}>
                <Text type="secondary">Demissão: </Text>
                <Text>{formatData(funcionario.dataDemissao)}</Text>
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default FuncionarioCard;
