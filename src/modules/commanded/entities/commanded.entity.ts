import { ApiProperty } from '@nestjs/swagger';

/**
 * Entidade Commanded representa uma comanda no sistema
 * Esta entidade define a estrutura de dados retornada nas operações do módulo commanded
 */
export class Commanded {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único da comanda',
  })
  id: string;

  @ApiProperty({
    example: 123,
    description: 'Número da comanda',
  })
  numero: number;

  constructor(partial: Partial<Commanded>) {
    Object.assign(this, partial);
  }
}
