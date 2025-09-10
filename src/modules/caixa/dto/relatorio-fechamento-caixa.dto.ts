export class RelatorioFechamentoCaixaDto {
  caixa: {
    id: string;
    status: boolean;
    createdAt: Date;
    user: {
      id: string;
      nome: string;
    };
  };

  vendas: {
    id: string;
    status: string;
    tipoPedido: string;
    createdAt: Date;
    total: number;
    troco: number;
    payments: {
      id: string;
      valor: number;
      troco: number;
      methodPaymentId: string;
    }[];
  }[];

  movimentacoes: {
    id: string;
    valor: number;
    tipo: string;
    createdAt: Date;
  }[];

  fechamento: {
    id: string;
    totalMoment: number;
    totalMethods: number;
    totalChange: number;
    createAt: Date;
    metodosPagamento: {
      id: string;
      nome: string;
      tipo: string;
      valorInformado: number;
      descricao: string;
      valorReal: number;
      diferenca: number;
    }[];
  };

  resumo: {
    totalVendas: number;
    totalMovimentacoes: number;
    totalTroco: number;
    totalInformado: number;
    totalReal: number;
    diferencaTotal: number;
  };
}
