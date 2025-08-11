import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCaixaDto {
  @ApiProperty({
    example: true,
    description: 'Status do caixa (ativo/inativo)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do usuário responsável pelo caixa',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
