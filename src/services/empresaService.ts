import { apiClient } from './baseService/axiosConfig';

export const GetEmpresaService = async () => {
  try {
    const response = await apiClient.get('/empresas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    throw error;
  }
};
