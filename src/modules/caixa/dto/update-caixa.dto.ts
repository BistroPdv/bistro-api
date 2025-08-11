import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';

export class UpdateCaixaDto {
  @ApiProperty({
    example: true,
    description: 'Status do caixa (ativo/inativo)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do usuário responsável pelo caixa',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
