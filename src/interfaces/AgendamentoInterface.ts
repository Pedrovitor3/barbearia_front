import type { FormValues } from './FormData';
import type { ServicoInterface } from './ServicoInterface';

export interface AgendamentoInterface
  extends Omit<FormValues, 'data' | 'horario'> {
  barbearia: string;
  servicosSelecionados: ServicoInterface[];
  precoTotal: number;
  duracaoTotal: number;
  data: string;
  horario: string;
}

export interface AgendamentoFormData {
  clienteId: number;
  funcionarioId: number;
  servicoId: number;
  dataAgendamento: string; // YYYY-MM-DD string - mais confiável
  horarioInicio: string; // HH:mm string para PostgreSQL
  horarioFim: string; // HH:mm string para PostgreSQL
  valor?: number;
  observacoes?: string;
  empresaId: number;
}
