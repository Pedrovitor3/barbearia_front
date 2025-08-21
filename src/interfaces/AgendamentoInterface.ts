import type { FormValues } from './FormData';
import type { Servico } from './ServicoInterface';

export interface AgendamentoInterface
  extends Omit<FormValues, 'data' | 'horario'> {
  barbearia: string;
  servicosSelecionados: Servico[];
  precoTotal: number;
  duracaoTotal: number;
  data: string;
  horario: string;
}

export interface AgendamentoFormData {
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  dataAgendamento: Date;
  horarioInicio: string;
  horarioFim: string;
  valor?: number;
  observacoes?: string;
}
