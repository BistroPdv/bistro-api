# Sistema de Tratamento de Erros Robusto

Este documento explica como usar o novo sistema de tratamento de erros implementado no projeto Bistro API.

## 🎯 Objetivos

- **Padronização**: Respostas de erro consistentes em toda a API
- **Rastreabilidade**: IDs únicos para cada erro para facilitar debugging
- **Logging**: Logs estruturados e detalhados
- **Manutenibilidade**: Código mais limpo e fácil de manter
- **UX**: Mensagens de erro claras e úteis para o frontend

## 📁 Estrutura

```
src/common/
├── dto/
│   └── error-response.dto.ts          # DTOs para respostas de erro
├── exceptions/
│   ├── business.exception.ts          # Exceções customizadas
│   └── index.ts
├── filters/
│   ├── global-exception.filter.ts     # Filtro global de exceções
│   ├── prisma-exception.filter.ts     # Filtro específico do Prisma (legado)
│   └── index.ts
├── interceptors/
│   ├── error-response.interceptor.ts  # Interceptor para logging
│   └── index.ts
├── utils/
│   └── error-handler.util.ts          # Utilitários para tratamento de erros
└── examples/
    └── controller-refactor.example.ts # Exemplos de refatoração
```

## 🚀 Como Usar

### 1. Uso Básico em Controllers

```typescript
import { ErrorHandler } from '../common/utils/error-handler.util';

@Controller('categorias')
export class CategoryController {
  async create(@Req() req: FastifyRequest) {
    return await ErrorHandler.execute(
      () => this.categoryService.create(req.body, req.user.restaurantCnpj),
      'Erro ao criar categoria',
    );
  }
}
```

### 2. Validações de Negócio

```typescript
async create(@Req() req: FastifyRequest) {
  // Validações obrigatórias
  ErrorHandler.validateRequired(req.body, 'nome', req.body.nome);
  ErrorHandler.validateRequired(req.body, 'email', req.body.email);

  // Validações de formato
  ErrorHandler.validateEmail(req.body.email);
  ErrorHandler.validateCNPJ(req.body.cnpj);

  return await ErrorHandler.execute(
    () => this.categoryService.create(req.body),
    'Erro ao criar categoria'
  );
}
```

### 3. Verificação de Recursos

```typescript
async findOne(id: string, cnpj: string) {
  const category = await ErrorHandler.execute(
    () => this.categoryService.findOne(id, cnpj),
    'Erro ao buscar categoria'
  );

  // Validação automática de recurso existente
  ErrorHandler.validateResourceExists(category, 'Categoria');

  return category;
}
```

### 4. Exceções Customizadas

```typescript
import {
  BusinessException,
  BusinessErrorCode,
} from '../common/exceptions/business.exception';

// Validação customizada
if (req.body.nome.length < 3) {
  throw BusinessException.validation('Nome deve ter pelo menos 3 caracteres', [
    'nome deve ter pelo menos 3 caracteres',
  ]);
}

// Recurso não encontrado
throw BusinessException.notFound('Categoria');

// Conflito
throw BusinessException.alreadyExists('Categoria', 'nome');

// Acesso negado
throw BusinessException.forbidden('Você não tem permissão para esta operação');
```

## 📊 Formato das Respostas de Erro

### Sucesso

```json
{
  "id": "123",
  "nome": "Categoria Teste",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Erro de Validação

```json
{
  "statusCode": 400,
  "message": "Dados inválidos fornecidos",
  "errorCode": "VALIDATION_ERROR",
  "details": ["O campo nome é obrigatório", "O email deve ter formato válido"],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/categorias",
  "method": "POST",
  "errorId": "err_1705312200000_abc123def"
}
```

### Erro de Recurso Não Encontrado

```json
{
  "statusCode": 404,
  "message": "Categoria não encontrado",
  "errorCode": "NOT_FOUND",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/categorias/123",
  "method": "GET",
  "errorId": "err_1705312200000_xyz789ghi"
}
```

## 🔧 Códigos de Erro Disponíveis

| Código                   | Descrição                 | Status HTTP |
| ------------------------ | ------------------------- | ----------- |
| `VALIDATION_ERROR`       | Erro de validação         | 400         |
| `INVALID_DATA`           | Dados inválidos           | 400         |
| `MISSING_REQUIRED_FIELD` | Campo obrigatório ausente | 400         |
| `UNAUTHORIZED`           | Não autorizado            | 401         |
| `FORBIDDEN`              | Acesso negado             | 403         |
| `NOT_FOUND`              | Recurso não encontrado    | 404         |
| `ALREADY_EXISTS`         | Recurso já existe         | 409         |
| `CONFLICT`               | Conflito                  | 409         |
| `INTERNAL_ERROR`         | Erro interno              | 500         |
| `EXTERNAL_SERVICE_ERROR` | Erro de serviço externo   | 502         |

## 📝 Logging

O sistema automaticamente gera logs estruturados:

```json
{
  "level": "error",
  "message": "Internal Server Error: Erro ao criar categoria",
  "errorId": "err_1705312200000_abc123def",
  "method": "POST",
  "url": "/api/categorias",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.100",
  "statusCode": 500,
  "errorCode": "INTERNAL_ERROR",
  "body": { "nome": "Teste" }
}
```

## 🔄 Migração de Controllers Existentes

### Antes

```typescript
async create(@Req() req: FastifyRequest) {
  try {
    const result = await this.categoryService.create(req.body, req.user.restaurantCnpj);
    return result;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException('Erro interno', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
```

### Depois

```typescript
async create(@Req() req: FastifyRequest) {
  return await ErrorHandler.execute(
    () => this.categoryService.create(req.body, req.user.restaurantCnpj),
    'Erro ao criar categoria'
  );
}
```

## 🎨 Vantagens

1. **Código mais limpo**: Menos boilerplate de try/catch
2. **Consistência**: Todas as respostas de erro seguem o mesmo padrão
3. **Rastreabilidade**: Cada erro tem um ID único
4. **Logging automático**: Logs estruturados sem código adicional
5. **Validações centralizadas**: Funções utilitárias para validações comuns
6. **Manutenibilidade**: Fácil de adicionar novos tipos de erro
7. **Documentação**: Swagger automaticamente documenta os formatos de erro

## 🚨 Importante

- **Sempre use** `ErrorHandler.execute()` para operações que podem falhar
- **Valide dados** antes de enviar para o service
- **Use exceções específicas** quando possível
- **Não ignore erros** - deixe o sistema tratá-los automaticamente
- **Teste** os cenários de erro para garantir que as mensagens estão claras
