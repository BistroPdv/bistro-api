import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindByMesaQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Mostrar imagem do produto',
    example: 'true',
    type: String,
  })
  @IsOptional()
  @IsString()
  prodImage?: string;

  @ApiPropertyOptional({
    description: 'ID da comanda',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString()
  comandaId?: string;
}
