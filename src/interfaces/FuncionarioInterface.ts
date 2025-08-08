import type { EmpresaInterface } from './EmpresaInterface';

export interface FuncionarioInterface {
  funcionarioId: number;
  pessoaId: number;
  empresaId: number;
  cargo: string; //'dono' |
  salario: number | string; //verificar bd
  dataAdmissao: string; // YYYY-MM-DD
  dataDemissao: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  empresa: EmpresaInterface;
}
