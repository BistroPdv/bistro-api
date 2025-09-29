import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidade Category representa uma categoria no sistema
 * Esta entidade define a estrutura de dados retornada nas operações do módulo category
 */
export class Category {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único da categoria',
  })
  id: string;

  @ApiProperty({
    example: 'Lanches',
    description: 'Nome da categoria',
  })
  nome: string;

  @ApiProperty({
    example: 'https://exemplo.com/imagem-categoria.jpg',
    description: 'URL da imagem da categoria',
    required: false,
  })
  imagem?: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Cor da categoria em formato hexadecimal',
    required: false,
  })
  cor?: string;

  @ApiProperty({
    example: true,
    description: 'Status da categoria (ativo/inativo)',
  })
  ativo: boolean;

  @ApiProperty({
    example: 0,
    description: 'Ordem de exibição da categoria',
  })
  ordem: number;

  @ApiProperty({
    example: false,
    description: 'Se a categoria tem promoção ativa',
  })
  temPromocao: boolean;

  @ApiProperty({
    example: 'CAT123456',
    description: 'ID externo da categoria (integração)',
    required: false,
  })
  externoId?: string;

  @ApiProperty({
    example: '12345678000123',
    description: 'CNPJ do restaurante',
  })
  restaurantCnpj: string;

  @ApiProperty({
    example: false,
    description: 'Se a categoria foi deletada',
  })
  delete: boolean;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Data de criação da categoria',
  })
  createAt: Date;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Data da última atualização da categoria',
    required: false,
  })
  updateAt?: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da impressora associada à categoria',
    required: false,
  })
  impressoraId?: string;

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
