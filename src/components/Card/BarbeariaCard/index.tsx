// BarbeariaCard.tsx
import { Card } from 'antd';
import { EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import type { EmpresaInterface } from '../../../interfaces/EmpresaInterface';

interface BarbeariaCardProps {
  empresa: EmpresaInterface;
  onCardClick: (id: number) => void;
  onSettingsClick: (id: number) => void;
  onMoreOptionsClick: (id: number) => void;
}

const EmpresaCard: React.FC<BarbeariaCardProps> = ({
  empresa,
  onCardClick,
  onSettingsClick,
  onMoreOptionsClick,
}) => {
  const { Meta } = Card;
  const {
    empresaId,
    nomeFantasia,
    // bairro,
    // cidade,
    // image,
    // descricao,
    // preco,
    // barbeiros,
    email,
    telefone,
  } = empresa;

  return (
    <Card
      hoverable
      className="click-card"
      style={{ width: 320, marginBottom: 16 }}
      // cover={
      //   <img
      //     src={image}
      //     alt={title}
      //     style={{
      //       height: 200,
      //       objectFit: 'cover',
      //       borderRadius: '8px 8px 0 0',
      //     }}
      //   />
      // }
      actions={[
        <SettingOutlined
          key="setting"
          onClick={e => {
            e.stopPropagation();
            onSettingsClick(empresaId);
          }}
        />,
        <EllipsisOutlined
          key="ellipsis"
          onClick={e => {
            e.stopPropagation();
            onMoreOptionsClick(empresaId);
          }}
        />,
      ]}
      onClick={() => onCardClick(empresaId)}
    >
      <Meta
        title={
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {nomeFantasia}
          </span>
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
              {email}
            </p>

            <div style={{ marginTop: '12px' }}>
              <p
                style={{
                  margin: '4px 0',
                  color: '#888',
                  fontSize: '13px',
                }}
              >
                {/* 📍 {bairro}, {cidade} */}
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
              {empresa && (
                <p
                  style={{
                    margin: '4px 0',
                    color: '#888',
                    fontSize: '13px',
                  }}
                >
                  {/* ✂️ {empresa.slice(0, 2).join(', ')}
                  {empresa.length > 2 && ` +${empresa.length - 2}`} */}
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
                A partir de R$
                {/* {preco.toFixed(2).replace('.', ',')} */}
              </span>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default EmpresaCard;
