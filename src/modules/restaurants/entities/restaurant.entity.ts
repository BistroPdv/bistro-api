import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidade Restaurant representa um restaurante no sistema
 * Esta entidade define a estrutura de dados retornada nas operações do módulo restaurants
 */
export class Restaurant {
  @ApiProperty({
    example: '12345678000123',
    description: 'CNPJ único do restaurante',
  })
  cnpj: string;

  @ApiProperty({
    example: '10000000-0000-0000-0000-000000000000',
    description: 'Token único da aplicação para o restaurante',
  })
  appToken: string;

  @ApiProperty({
    example: 'Restaurante Delícias',
    description: 'Nome do restaurante',
  })
  name: string;

  @ApiProperty({
    example: 'contato@restaurante.com',
    description: 'Email do restaurante',
  })
  email: string;

  @ApiProperty({
    example: '(11) 99999-9999',
    description: 'Telefone do restaurante',
  })
  phone: string;

  constructor(partial: Partial<Restaurant>) {
    Object.assign(this, partial);
  }
}
