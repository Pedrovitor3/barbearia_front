export interface EmpresaInterface {
  empresaId: number;
  nomeFantasia: string;
  slug: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  email: string;
  website: string;
  ativo: boolean;
  createdAt: string; // formato ISO
  updatedAt: string; // formato ISO
  deletedAt: string;
}
