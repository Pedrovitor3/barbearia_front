import { apiClient } from './baseService/axiosConfig';

export const ListarClienteEmpresaService = async (empresaId: number) => {
  try {
    const response = await apiClient.post('/cliente', {
      empresaId,
    });
    const clientesEmpresa = response.data;
    return clientesEmpresa || [];
  } catch (error) {
    console.log('erro ao listar cliente empresa');
    throw error;
  }
};
