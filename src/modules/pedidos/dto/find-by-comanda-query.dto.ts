import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusPedido } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FindByComandaQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Mostrar imagem do produto',
    example: 'true',
    type: String,
  })
  @IsOptional()
  @IsString()
  prodImage?: string;

  @ApiPropertyOptional({
    description: 'Status do pedido',
    example: 'ABERTO',
    type: StatusPedido,
    enum: StatusPedido,
    enumName: 'StatusPedido',
  })
  @IsOptional()
  @IsEnum(StatusPedido)
  status: StatusPedido = StatusPedido.ABERTO;
}
