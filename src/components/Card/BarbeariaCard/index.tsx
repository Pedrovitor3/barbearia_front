// BarbeariaCard.tsx
import { Card } from 'antd';
import { EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

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

interface BarbeariaCardProps {
  barbearia: Barbearia;
  onCardClick: (id: string) => void;
  onSettingsClick: (id: string) => void;
  onMoreOptionsClick: (id: string) => void;
}

const BarbeariaCard: React.FC<BarbeariaCardProps> = ({
  barbearia,
  onCardClick,
  onSettingsClick,
  onMoreOptionsClick,
}) => {
  const { Meta } = Card;
  const {
    id,
    title,
    bairro,
    cidade,
    image,
    descricao,
    preco,
    barbeiros,
    telefone,
  } = barbearia;

  return (
    <Card
      hoverable
      className="click-card"
      style={{ width: 320, marginBottom: 16 }}
      cover={
        <img
          src={image}
          alt={title}
          style={{
            height: 200,
            objectFit: 'cover',
            borderRadius: '8px 8px 0 0',
          }}
        />
      }
      actions={[
        <SettingOutlined
          key="setting"
          onClick={e => {
            e.stopPropagation();
            onSettingsClick(id);
          }}
        />,
        <EllipsisOutlined
          key="ellipsis"
          onClick={e => {
            e.stopPropagation();
            onMoreOptionsClick(id);
          }}
        />,
      ]}
      onClick={() => onCardClick(id)}
    >
      <Meta
        title={
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</span>
        }
        description={
          <div style={{ minHeight: '120px' }}>
            <p
              style={{
                margin: '8px 0',
                color: '#666',
                fontSize: '14px',
                lineHeight: '1.4',
              }}
            >
              {descricao}
            </p>

            <div style={{ marginTop: '12px' }}>
              <p
                style={{
                  margin: '4px 0',
                  color: '#888',
                  fontSize: '13px',
                }}
              >
                📍 {bairro}, {cidade}
              </p>
              <p
                style={{
                  margin: '4px 0',
                  color: '#888',
                  fontSize: '13px',
                }}
              >
                📞 {telefone}
              </p>
              {barbeiros && barbeiros.length > 0 && (
                <p
                  style={{
                    margin: '4px 0',
                    color: '#888',
                    fontSize: '13px',
                  }}
                >
                  ✂️ {barbeiros.slice(0, 2).join(', ')}
                  {barbeiros.length > 2 && ` +${barbeiros.length - 2}`}
                </p>
              )}
            </div>

            <div
              style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #f0f0f0',
              }}
            >
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#52c41a',
                }}
              >
                A partir de R$ {preco.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default BarbeariaCard;
