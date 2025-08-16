import type { EmpresaInterface } from '../interfaces/EmpresaInterface';
import { apiClient } from './baseService/axiosConfig';

export const GetEmpresaService = async () => {
  try {
    const response = await apiClient.get('/empresas');
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    throw error;
  }
};
export const CreateEmpresaService = async (novaEmpresa: EmpresaInterface) => {
  const { nomeFantasia, slug, razaoSocial, cnpj, ativo } = novaEmpresa;
  try {
    const response = await apiClient.post('/empresa', {
      nomeFantasia,
      slug,
      razaoSocial,
      cnpj,
      ativo,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    throw error;
  }
};
