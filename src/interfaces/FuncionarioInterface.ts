import type { EmpresaInterface } from './EmpresaInterface';
import type { PessoaInterface } from './PessoaInterface,';
export interface FuncionarioInterface {
  funcionarioId: number;
  pessoaId: number;
  empresaId: number;
  cargo: string;
  salario: number | string | null;
  dataAdmissao: string;
  dataDemissao: string | null;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  empresa?: EmpresaInterface;
  pessoa: PessoaInterface;
}

export interface FuncionarioFormData {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  sexo: 'M' | 'F';
  username: string; // email
  cargo: string;
  salario: number | null;
  dataAdmissao: string;
  empresaId: number;
}
