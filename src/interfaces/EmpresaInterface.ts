export interface EmpresaInterface {
  empresaId: number;
  nomeFantasia: string;
  slug: string;
  razaoSocial: string;
  cnpj: string;
  telefone?: string;
  email?: string;
  website?: string | null;
  ativo: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface EmpresaFormData {
  nomeFantasia: string;
  slug: string;
  razaoSocial: string;
  cnpj: string;
}
