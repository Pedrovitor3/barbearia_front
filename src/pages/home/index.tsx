import { EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Card, Flex } from "antd";
import barbeariaJoImg from "../../assets/BarbeariaImagens/barbeariaJo.png";
import "./index.css"; // <-- importe o CSS

const Home = () => {
  const { Meta } = Card;

  const barbearias = [
    {
      id: "jo",
      title: "Barbearia do Jô",
      bairro: "Cidade Jardim",
      image: barbeariaJoImg,
    },
    {
      id: "ze",
      title: "Barbearia do Zé",
      bairro: "Centro",
      image: barbeariaJoImg,
    },
    {
      id: "rei",
      title: "Rei da Navalha",
      bairro: "Jardim América",
      image: barbeariaJoImg,
    },
    {
      id: "elite",
      title: "Elite Barber",
      bairro: "Setor Sul",
      image: barbeariaJoImg,
    },
    {
      id: "central",
      title: "Barbearia Central",
      bairro: "Vila Nova",
      image: barbeariaJoImg,
    },
    {
      id: "dois",
      title: "Dois Irmãos Barber",
      bairro: "Morada do Sol",
      image: barbeariaJoImg,
    },
  ];

  const handleOpenBarbearia = (id: string) => {
    console.log("barbearia id", id);
  };

  return (
    <Flex wrap gap="small" justify="space-evenly">
      {barbearias.map(({ id, title, bairro, image }) => (
        <Card
          key={id}
          hoverable
          className="click-card" // <-- classe com animação
          style={{ width: 300 }}
          cover={<img src={image} alt={title} />}
          actions={[
            <SettingOutlined key="setting" />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
          onClick={() => handleOpenBarbearia(id)}
        >
          <Meta title={title} description={`Barbearia no ${bairro}`} />
        </Card>
      ))}
    </Flex>
  );
};

export default Home;
