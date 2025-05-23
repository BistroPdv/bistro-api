import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'X-Burger Especial',
    description: 'Nome da categoria',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;
}
