import type { EmpresaInterface } from '../interfaces/EmpresaInterface';
import type { FuncionarioFormData } from '../interfaces/FuncionarioInterface';
import { apiClient } from './baseService/axiosConfig';

export const GetFuncionarioService = async () => {
  try {
    const response = await apiClient.get('/funcionarios');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    throw error;
  }
};
export const CreateFuncionarioService = async (
  novoFuncionario: FuncionarioFormData
) => {
  const {
    cargo,
    cpf,
    dataAdmissao,
    dataNascimento,
    empresaId,
    nome,
    username,
    sexo,
    sobrenome,
  } = novoFuncionario;
  try {
    const response = await apiClient.post('/funcionario', {
      nome,
      sobrenome,
      cpf,
      dataNascimento,
      sexo,
      username,
      empresaId,
      cargo,
      dataAdmissao,
    });
    console.log('Funcionario criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar funcionarios:', error);
    throw error;
  }
};
