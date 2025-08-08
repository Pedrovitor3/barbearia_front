export interface PessoaInterface {
  pessoaId: number;
  cpf: string;
  nome: string;
  sobrenome: string;
  dataNascimento: string; //YYYY-MM-DD
  sexo: string; //M | F
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}
