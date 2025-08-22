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
export const ListarFuncionarioEmpresaService = async (empresaId: number) => {
  try {
    const response = await apiClient.post('/funcionarios', {
      empresaId,
    });
    const funcionariosEmpresa = response.data;
    return funcionariosEmpresa || [];
  } catch (error) {
    console.log('erro ao listar funcionarios da empresa', error);
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
    email,
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
      email,
    });
    console.log('Funcionario criado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar funcionarios:', error);
    throw error;
  }
};

export const UpdateFuncionarioService = async (
  funcionarioId: number,
  funcionarioData: Partial<FuncionarioFormData>
) => {
  const {
    cargo,
    cpf,
    dataAdmissao,
    dataNascimento,
    nome,
    sexo,
    sobrenome,
    email,
    salario,
  } = funcionarioData;

  try {
    const response = await apiClient.put(`/funcionario/${funcionarioId}`, {
      ...(nome !== undefined && { nome }),
      ...(sobrenome !== undefined && { sobrenome }),
      ...(cpf !== undefined && { cpf }),
      ...(dataNascimento !== undefined && { dataNascimento }),
      ...(sexo !== undefined && { sexo }),
      ...(email !== undefined && { email }),
      ...(cargo !== undefined && { cargo }),
      ...(dataAdmissao !== undefined && { dataAdmissao }),
      // ...(dataDemissao !== undefined && { dataDemissao }),
      // ...(ativo !== undefined && { ativo }),
      ...(salario !== undefined && { salario }),
    });

    console.log('Funcionário atualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw error;
  }
};

export const DeleteFuncionarioService = async (funcionarioId: number) => {
  try {
    const response = await apiClient.delete(`/funcionario/${funcionarioId}`);
    console.log('Funcionário excluído:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    throw error;
  }
};
