import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(restaurantCnpj: string) {
    // Buscar pedidos dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pedidos = await this.prisma.pedidos.findMany({
      where: {
        restaurantCnpj,
        createdAt: {
          gte: sevenDaysAgo,
        },
        delete: false,
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });

    // Agrupar vendas por dia
    const salesByDay = pedidos.reduce((acc: any, pedido) => {
      const day = pedido.createdAt
        .toLocaleDateString('pt-BR', {
          weekday: 'short',
        })
        .replace('.', '');

      const total = pedido.produtos.reduce(
        (sum, item) => sum + item.produto.preco * item.quantidade,
        0,
      );

      if (!acc[day]) {
        acc[day] = {
          total: 0,
          online: 0,
          presencial: 0,
        };
      }

      acc[day].total += total;
      acc[day].presencial += total;

      return acc;
    }, {});

    // Formatar dados de vendas
    const salesData = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map(
      (day) => ({
        name: day,
        total: salesByDay[day.toLocaleLowerCase()]?.total || 0,
        online: salesByDay[day.toLocaleLowerCase()]?.online || 0,
        presencial: salesByDay[day.toLocaleLowerCase()]?.presencial || 0,
      }),
    );

    // Agrupar produtos mais vendidos
    const productSales = pedidos.reduce((acc: any, pedido) => {
      pedido.produtos.forEach((item) => {
        const productId = item.produtoId;
        if (!acc[productId]) {
          acc[productId] = {
            name: item.produto.nome,
            amount: 0,
            rating: 4.5, // Aqui você pode adicionar a lógica para calcular a avaliação média
          };
        }
        acc[productId].amount += item.quantidade;
      });
      return acc;
    }, {});

    // Formatar top produtos
    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 5);

    const resp = {
      sales: salesData,
      length: pedidos.length,
      topProducts,
      totalSales: salesData.reduce((acc, curr) => acc + curr.total, 0),
      totalOnline: salesData.reduce((acc, curr) => acc + curr.online, 0),
      totalPresencial: salesData.reduce(
        (acc, curr) => acc + curr.presencial,
        0,
      ),
    };

    return resp;
  }
}
