import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantDto {
  @ApiPropertyOptional({
    example: 'Restaurante Delícias Atualizado',
    description: 'Nome do restaurante',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: '(11) 88888-8888',
    description: 'Telefone do restaurante',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'contato-atualizado@restaurante.com',
    description: 'Email do restaurante',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Se o restaurante emite NFE',
  })
  @IsOptional()
  @IsBoolean()
  nfe?: boolean;
}
