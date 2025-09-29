# Regras de Desenvolvimento - Bistro API

## 🚨 REGRA CRÍTICA: DTOs de Query

### **SEMPRE estender PaginationQueryDto - NUNCA substituir**

O `PaginationQueryDto` é um padrão fundamental que deve ser **SEMPRE** estendido para DTOs de query, nunca substituído.

#### ✅ CORRETO

```typescript
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindByMesaQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Mostrar imagem do produto' })
  @IsOptional()
  @IsString()
  prodImage?: string;

  @ApiPropertyOptional({ description: 'ID da comanda' })
  @IsOptional()
  @IsString()
  comandaId?: string;
}
```

#### ❌ ERRADO

```typescript
// NUNCA fazer isso - duplica campos
export class FindByMesaQueryDto {
  @ApiPropertyOptional({ description: 'Número da página' })
  page?: number;

  @ApiPropertyOptional({ description: 'Quantidade de itens por página' })
  limit?: number;

  // ... outros campos duplicados
}
```

### **Campos Incluídos no PaginationQueryDto**

- `page?: number` - Número da página
- `limit?: number` - Quantidade de itens por página
- `search?: Record<string, string>` - Filtros de busca dinâmica
- `status?: boolean | string` - Status do item

### **Vantagens do Padrão**

1. **Consistência**: Todos os DTOs de query têm os mesmos campos base
2. **Manutenibilidade**: Mudanças no `PaginationQueryDto` afetam todos os módulos
3. **Reutilização**: Não duplica código
4. **Padronização**: Swagger documenta de forma consistente

---

## Outras Regras Importantes

### **DTOs e Entidades**

- DTOs em pasta `dto/` dentro de cada módulo
- Entidades em pasta `entities/` dentro de cada módulo
- Arquivo `index.ts` para exportações
- Usar `PartialType(CreateDto)` para DTOs de update quando apropriado

### **Validações**

- Usar `class-validator` para validações
- `@IsNotEmpty()` para campos obrigatórios
- `@IsOptional()` para campos opcionais
- Documentar com `@ApiProperty()` e `@ApiPropertyOptional()`

### **Controllers**

- Usar decorators genéricos de erro (`@ApiListErrorResponses`, etc.)
- Configurar com `resourceName`, `resourceNamePlural` e `basePath`
- Documentar com `@ApiOperation()` e `@ApiResponse()`

### **Estrutura de Arquivos**

```
src/modules/[module]/
├── dto/
│   ├── create-[module].dto.ts
│   ├── update-[module].dto.ts
│   ├── find-[module]-query.dto.ts (estende PaginationQueryDto)
│   └── index.ts
├── entities/
│   ├── [module].entity.ts
│   └── index.ts
├── [module].controller.ts
├── [module].service.ts
└── [module].module.ts
```

---

**Data de Criação**: 2024-01-15  
**Última Atualização**: 2024-01-15  
**Mantido por**: Bistro API Team
