export interface PessoaInterface {
  pessoaId: number;
  cpf: string;
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  sexo: 'M' | 'F';
  username: string; // email
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  email: string;
}
