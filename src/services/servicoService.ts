import { apiClient } from './baseService/axiosConfig';

export const ListarServicosEmpresaService = async (empresaId: number) => {
  try {
    const response = await apiClient.post('/servicos', {
      empresaId,
    });
    const servicosEmpresa = response.data;
    return servicosEmpresa;
  } catch (error) {
    console.log('erro ao listar servicos empresa');
    throw error;
  }
};
