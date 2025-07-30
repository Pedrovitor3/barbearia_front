import type { Dayjs } from 'dayjs';

export interface FormValues {
  cliente: string;
  telefone?: string;
  servicos: string[];
  data: Dayjs;
  horario: Dayjs;
  observacoes?: string;
}
