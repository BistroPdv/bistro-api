import { ApiProperty } from '@nestjs/swagger';
import { StatusPedido, TipoPedido } from '@prisma/client';

/**
 * Entidade Pedido representa um pedido no sistema
 * Esta entidade define a estrutura de dados retornada nas operações do módulo pedidos
 */
export class Pedido {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único do pedido',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID da mesa associada ao pedido',
    required: false,
  })
  mesaId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'ID da comanda associada ao pedido',
    required: false,
  })
  comandaId?: string;

  @ApiProperty({
    example: StatusPedido.ABERTO,
    description: 'Status atual do pedido',
    enum: StatusPedido,
  })
  status: StatusPedido;

  @ApiProperty({
    example: 'Cliente solicitou cancelamento',
    description: 'Motivo do cancelamento (quando aplicável)',
    required: false,
  })
  motivoCancelamento?: string;

  @ApiProperty({
    example: 'PDV123456',
    description: 'Código do PDV externo',
    required: false,
  })
  pdvCodPedido?: string;

  @ApiProperty({
    example: TipoPedido.COUNTER,
    description: 'Tipo do pedido',
    enum: TipoPedido,
    required: false,
  })
  tipoPedido?: TipoPedido;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'ID do PDV externo',
    required: false,
  })
  idPdv?: string;

  @ApiProperty({
    example: false,
    description: 'Se o pedido foi deletado',
  })
  delete: boolean;

  @ApiProperty({
    example: '12345678000123',
    description: 'CNPJ do restaurante',
  })
  restaurantCnpj: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Data de criação do pedido',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Data da última atualização do pedido',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440004',
    description: 'ID do usuário responsável pelo pedido',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440005',
    description: 'ID do caixa associado ao pedido',
    required: false,
  })
  caixaId?: string;

  constructor(partial: Partial<Pedido>) {
    Object.assign(this, partial);
  }
}
