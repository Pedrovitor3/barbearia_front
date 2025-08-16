export const sistemaName = 'Bigode Time';
export const sistemaDescricao = 'Sistema para agendamento de horário';
export const sistemaVersao = '1.0.0-00';
export const domainNameProd = '';
export const domainNameHomo = 'http://localhost:5173';

export const domainNameDesv = 'localhost';

export const perfisSistema = {
  ADM: 'ADM',
  ATENDENTE: 'ATENDENTE',
  SUPORTE: 'SUPORTE',
  BASICO: 'BASICO',
  ALL: 'QUALQUER_PERFIL',
};

export const getConfig = (type: string) => {
  const configPub = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Methods': '*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  const configPriv = {
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTION',
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${localStorage.getItem('acess_token')}`,
      Token: localStorage.getItem('acess_token'),
    },
  };

  if (type === 'priv') {
    return configPriv;
  }

  return configPub;
};
