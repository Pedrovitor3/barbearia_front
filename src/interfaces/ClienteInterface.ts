import type { PessoaInterface } from './PessoaInterface,';

export interface ClienteInterface {
  clienteId: number;
  pessoaId: number;
  empresaId: number;
  dataCadastro: Date;
  preferencias: string;
  observacoes: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  pessoa: PessoaInterface;
}
