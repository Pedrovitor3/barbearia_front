import type { FuncionarioInterface } from './FuncionarioInterface';
import type { PessoaInterface } from './PessoaInterface,';

export interface UserInterface {
  token: string;
  usuarioId: number;
  pessoaId: number;
  username: string;
  senhaHash: string;
  ultimoLogin: string | null;
  ativo: boolean;
  createdAt: string; // formato ISO
  updatedAt: string; // formato ISO
  deletedAt: string | null; // formato ISO
  pessoa: PessoaInterface;
  clientes: [];
  funcionarios: FuncionarioInterface[];
  administradores: [];
}
