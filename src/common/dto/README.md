# Padrão de DTOs de Query

## Regra: Sempre Estender PaginationQueryDto

O `PaginationQueryDto` é um padrão que deve ser **estendido**, não substituído. Isso garante consistência em toda a aplicação.

## Exemplo Correto

### ❌ ERRADO - Duplicando campos
```typescript
export class FindByMesaQueryDto {
  @ApiPropertyOptional({ description: 'Número da página', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Quantidade de itens por página', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = undefined;

  // ... outros campos duplicados
}
```

### ✅ CORRETO - Estendendo PaginationQueryDto
```typescript
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindByMesaQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Mostrar imagem do produto',
    example: 'true',
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
```

## Vantagens do Padrão

1. **Consistência**: Todos os DTOs de query têm os mesmos campos base
2. **Manutenibilidade**: Mudanças no `PaginationQueryDto` afetam todos os módulos
3. **Reutilização**: Não duplica código
4. **Padronização**: Swagger documenta de forma consistente

## Campos Incluídos no PaginationQueryDto

- `page?: number` - Número da página
- `limit?: number` - Quantidade de itens por página  
- `search?: Record<string, string>` - Filtros de busca dinâmica
- `status?: boolean | string` - Status do item

## Exemplos de Uso

### Módulo de Produtos
```typescript
export class FindProductsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Categoria do produto' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({ description: 'Preço mínimo' })
  @IsOptional()
  @IsNumber()
  precoMin?: number;
}
```

### Módulo de Usuários
```typescript
export class FindUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Role do usuário' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ description: 'Usuário ativo' })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
```

## Regras Importantes

1. **SEMPRE** estender `PaginationQueryDto` para DTOs de query
2. **NUNCA** duplicar campos que já existem no `PaginationQueryDto`
3. **SEMPRE** usar `@ApiPropertyOptional` para campos opcionais
4. **SEMPRE** usar validações apropriadas do `class-validator`
5. **SEMPRE** documentar com exemplos claros
