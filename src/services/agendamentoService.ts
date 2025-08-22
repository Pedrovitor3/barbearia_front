import type { AgendamentoFormData } from '../interfaces/AgendamentoInterface';
import { apiClient } from './baseService/axiosConfig';

export const CreateAgendamentoService = async (
  dadosCompletos: AgendamentoFormData
) => {
  try {
    const {
      clienteId,
      dataAgendamento,
      empresaId,
      funcionarioId,
      horarioFim,
      horarioInicio,
      servicoId,
      observacoes,
      valor,
    } = dadosCompletos;

    const response = await apiClient.post('/agendamento', {
      clienteId,
      dataAgendamento,
      empresaId,
      funcionarioId,
      horarioFim,
      horarioInicio,
      servicoId,
      observacoes,
      valor,
    });
    return response.data || [];
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

export const ListarAgendamentosEmpresaService = async (empresaId: number) => {
  try {
    const response = await apiClient.post('/agendamentos', {
      empresaId,
    });
    const agendamentosEmpresa = response.data;
    return agendamentosEmpresa || [];
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};
