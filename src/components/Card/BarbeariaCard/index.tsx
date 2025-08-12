import { Card } from 'antd';
import { EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import type { EmpresaInterface } from '../../../interfaces/EmpresaInterface';
import barbeariaJoImg from '../../../assets/BarbeariaImagens/barbeariaJo.png';

interface EmpresaCardProps {
  empresa: EmpresaInterface;
  onCardClick: (id: number) => void;
  onSettingsClick: (id: number) => void;
  onMoreOptionsClick: (id: number) => void;
}

const EmpresaCard: React.FC<EmpresaCardProps> = ({
  empresa,
  onCardClick,
  onSettingsClick,
  onMoreOptionsClick,
}) => {
  const { Meta } = Card;
  const { empresaId, nomeFantasia, email, telefone, razaoSocial, cnpj, ativo } =
    empresa;

  return (
    <Card
      hoverable
      className="click-card"
      style={{ width: 320, marginBottom: 16 }}
      cover={
        <img
          src={barbeariaJoImg}
          alt={barbeariaJoImg}
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
              {razaoSocial}
            </p>

            <div style={{ marginTop: '12px' }}>
              <p
                style={{
                  margin: '4px 0',
                  color: '#888',
                  fontSize: '13px',
                }}
              >
                📄 CNPJ: {cnpj}
              </p>
              {telefone && (
                <p
                  style={{
                    margin: '4px 0',
                    color: '#888',
                    fontSize: '13px',
                  }}
                >
                  📞 {telefone}
                </p>
              )}
              {email && (
                <p
                  style={{
                    margin: '4px 0',
                    color: '#888',
                    fontSize: '13px',
                  }}
                >
                  📧 {email}
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
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: ativo ? '#52c41a' : '#ff4d4f',
                }}
              >
                {ativo ? '✅ Ativa' : '❌ Inativa'}
              </span>
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default EmpresaCard;
