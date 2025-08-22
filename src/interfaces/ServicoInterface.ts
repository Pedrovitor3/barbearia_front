export interface ServicoInterface {
  servicoId: number;
  empresaId: number;
  nome: string;
  descricao: string;
  duracaoMinutos: number;
  preco: string;
  categoria: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
