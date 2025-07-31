import { Calendar, Card, Tag, Typography, Divider, Button, Select } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import AgendamentoModal from '../../components/Modal/AgendamentoModal';
import type { AgendamentoInterface } from '../../interfaces/AgendamentoInterface';

const { Title, Text } = Typography;

const Barbearia = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Dados fictícios dos agendamentos
  const agendamentos = [
    {
      id: 1,
      data: '2025-07-30',
      horario: '09:00',
      cliente: 'João Silva',
      servico: 'Corte + Barba',
      status: 'confirmado',
    },
    {
      id: 2,
      data: '2025-07-30',
      horario: '10:30',
      cliente: 'Pedro Santos',
      servico: 'Corte',
      status: 'confirmado',
    },
    {
      id: 3,
      data: '2025-07-30',
      horario: '14:00',
      cliente: 'Carlos Lima',
      servico: 'Barba',
      status: 'pendente',
    },
    {
      id: 4,
      data: '2025-07-31',
      horario: '11:00',
      cliente: 'Roberto Costa',
      servico: 'Corte + Barba',
      status: 'confirmado',
    },
  ];

  // Horários disponíveis da barbearia
  const horariosDisponiveis = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
  ];

  const handleConfirmAgendamento = (agendamento: AgendamentoInterface) => {
    console.log('Agendamento confirmado:', agendamento);
    setModalVisible(false);
    // Aqui você salvaria o agendamento
  };

  const getAgendamentosPorData = (data: string) => {
    return agendamentos.filter(agendamento => agendamento.data === data);
  };

  const getHorariosLivres = (data: string) => {
    const agendamentosData = getAgendamentosPorData(data);
    const horariosOcupados = agendamentosData.map(ag => ag.horario);
    return horariosDisponiveis.filter(
      horario => !horariosOcupados.includes(horario)
    );
  };

  const onSelect = (value: Dayjs) => {
    const dataFormatada = value.format('YYYY-MM-DD');
    console.log('Data selecionada:', dataFormatada);
  };

  const dataCellRender: CalendarProps<Dayjs>['dateCellRender'] = value => {
    const dataFormatada = value.format('YYYY-MM-DD');
    const agendamentosData = getAgendamentosPorData(dataFormatada);

    if (agendamentosData.length > 0) {
      return (
        <div style={{ fontSize: '12px' }}>
          {agendamentosData.map(ag => (
            <div key={ag.id} style={{ color: '#1890ff' }}>
              {ag.horario}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Header customizado para mostrar apenas navegação por mês
  const headerRender: CalendarProps<Dayjs>['headerRender'] = ({
    value,
    onChange,
  }) => {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const currentMonth = value.month();
    const currentYear = value.year();

    const goToPreviousMonth = () => {
      const newDate = value.subtract(1, 'month');
      setCurrentDate(newDate);
      onChange(newDate);
    };

    const goToNextMonth = () => {
      const newDate = value.add(1, 'month');
      setCurrentDate(newDate);
      onChange(newDate);
    };

    const handleMonthChange = (month: number) => {
      const newDate = value.month(month);
      setCurrentDate(newDate);
      onChange(newDate);
    };

    return (
      <div
        style={{
          padding: '0 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '16px',
        }}
      >
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={goToPreviousMonth}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Select
            value={currentMonth}
            onChange={handleMonthChange}
            style={{ width: 120 }}
            size="small"
          >
            {months.map((month, index) => (
              <Select.Option key={index} value={index}>
                {month}
              </Select.Option>
            ))}
          </Select>
          <Text strong>{currentYear}</Text>
        </div>

        <Button type="text" icon={<RightOutlined />} onClick={goToNextMonth} />
      </div>
    );
  };

  const dataAtual = dayjs().format('YYYY-MM-DD');
  const agendamentosHoje = getAgendamentosPorData(dataAtual);
  const horariosLivresHoje = getHorariosLivres(dataAtual);

  const handleNovoAgendamento = () => {
    setModalVisible(true);
  };

  return (
    <div style={{ padding: '0px' }}>
      <Title level={2}>Barbearia do Jô</Title>
      <Text type="secondary">Cidade Jardim - Goiânia</Text>

      <Divider />
      <Button
        type="primary"
        icon={<CalendarOutlined />}
        onClick={handleNovoAgendamento}
      >
        Novo Agendamento
      </Button>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* Calendário */}
        <div style={{ flex: 1, minWidth: '300px', margin: '10px 0px' }}>
          <Calendar
            value={currentDate}
            onSelect={onSelect}
            dateCellRender={dataCellRender}
            headerRender={headerRender}
          />
        </div>

        {/* Informações do dia atual */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <Card title="Agendamentos de Hoje" style={{ margin: '12px 0' }}>
            {agendamentosHoje.length > 0 ? (
              agendamentosHoje.map(agendamento => (
                <Card.Grid
                  key={agendamento.id}
                  style={{ width: '100%', padding: '10px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <ClockCircleOutlined />
                        <Text strong>{agendamento.horario}</Text>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '2px',
                        }}
                      >
                        <UserOutlined />
                        <Text>{agendamento.cliente}</Text>
                      </div>
                      <Text type="secondary">{agendamento.servico}</Text>
                    </div>
                    <Tag
                      color={
                        agendamento.status === 'confirmado' ? 'green' : 'orange'
                      }
                    >
                      {agendamento.status}
                    </Tag>
                  </div>
                </Card.Grid>
              ))
            ) : (
              <Text type="secondary">Nenhum agendamento para hoje</Text>
            )}
          </Card>

          <Card title="Horários Livres Hoje">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {horariosLivresHoje.map(horario => (
                <Tag key={horario} color="blue" style={{ margin: '2px' }}>
                  {horario}
                </Tag>
              ))}
            </div>
            {horariosLivresHoje.length === 0 && (
              <Text type="secondary">Todos os horários estão ocupados</Text>
            )}
          </Card>
        </div>
      </div>
      <AgendamentoModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirmAgendamento}
        barbearia="Barbearia do Jô"
      />
    </div>
  );
};

export default Barbearia;
