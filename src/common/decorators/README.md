# Decorators de Resposta de Erro Genéricos

Este arquivo contém decorators genéricos para documentar respostas de erro no Swagger de forma padronizada e reutilizável.

## Decorators Disponíveis

### 1. `ApiErrorResponses(config?)`

Decorator base que documenta todas as respostas de erro padrão.

### 2. `ApiCreateErrorResponses(config?)`

Para operações de criação (POST).

### 3. `ApiUpdateErrorResponses(config?)`

Para operações de atualização (PUT/PATCH).

### 4. `ApiFindErrorResponses(config?)`

Para operações de busca genérica.

### 5. `ApiListErrorResponses(config?)`

Para operações de listagem com paginação (GET).

### 6. `ApiFindByIdErrorResponses(config?)`

Para operações de busca por ID (GET /:id).

### 7. `ApiDeleteErrorResponses(config?)`

Para operações de exclusão (DELETE).

### 8. `ApiUpdateOrderErrorResponses(config?)`

Para operações de atualização de ordem (PUT /ordem).

## Configuração

Todos os decorators aceitam um objeto de configuração opcional:

```typescript
interface ApiErrorConfig {
  resourceName?: string; // Nome do recurso no singular (ex: "Categoria")
  resourceNamePlural?: string; // Nome do recurso no plural (ex: "Categorias")
  basePath?: string; // Caminho base da API (ex: "/api/categorias")
}
```

## Exemplos de Uso

### Exemplo 1: Módulo de Categorias

```typescript
@Get()
@ApiOperation({ summary: 'Listar todas as categorias' })
@ApiResponse({
  status: 200,
  description: 'Lista de categorias retornada com sucesso',
  type: PaginationCategoryResponse,
})
@ApiListErrorResponses({
  resourceName: 'Categoria',
  resourceNamePlural: 'Categorias',
  basePath: '/api/categorias',
})
async findAll() {
  // implementação
}

@Get(':id')
@ApiOperation({ summary: 'Buscar categoria por ID' })
@ApiResponse({
  status: 200,
  description: 'Categoria encontrada com sucesso',
  type: Category,
})
@ApiFindByIdErrorResponses({
  resourceName: 'Categoria',
  resourceNamePlural: 'Categorias',
  basePath: '/api/categorias',
})
async findOne(@Param('id') id: string) {
  // implementação
}

@Post()
@ApiOperation({ summary: 'Criar nova categoria' })
@ApiBody({ type: CreateCategoryDto })
@ApiResponse({
  status: 201,
  description: 'Categoria criada com sucesso',
  type: Category,
})
@ApiCreateErrorResponses({
  resourceName: 'Categoria',
  resourceNamePlural: 'Categorias',
  basePath: '/api/categorias',
})
async create(@Body() createCategoryDto: CreateCategoryDto) {
  // implementação
}
```

### Exemplo 2: Módulo de Produtos

```typescript
@Get()
@ApiOperation({ summary: 'Listar todos os produtos' })
@ApiResponse({
  status: 200,
  description: 'Lista de produtos retornada com sucesso',
  type: PaginationProductResponse,
})
@ApiListErrorResponses({
  resourceName: 'Produto',
  resourceNamePlural: 'Produtos',
  basePath: '/api/produtos',
})
async findAll() {
  // implementação
}

@Post()
@ApiOperation({ summary: 'Criar novo produto' })
@ApiBody({ type: CreateProductDto })
@ApiResponse({
  status: 201,
  description: 'Produto criado com sucesso',
  type: Product,
})
@ApiCreateErrorResponses({
  resourceName: 'Produto',
  resourceNamePlural: 'Produtos',
  basePath: '/api/produtos',
})
async create(@Body() createProductDto: CreateProductDto) {
  // implementação
}
```

### Exemplo 3: Módulo de Usuários

```typescript
@Get()
@ApiOperation({ summary: 'Listar todos os usuários' })
@ApiResponse({
  status: 200,
  description: 'Lista de usuários retornada com sucesso',
  type: PaginationUserResponse,
})
@ApiListErrorResponses({
  resourceName: 'Usuário',
  resourceNamePlural: 'Usuários',
  basePath: '/api/usuarios',
})
async findAll() {
  // implementação
}

@Put(':id')
@ApiOperation({ summary: 'Atualizar usuário' })
@ApiBody({ type: UpdateUserDto })
@ApiResponse({
  status: 200,
  description: 'Usuário atualizado com sucesso',
  type: User,
})
@ApiUpdateErrorResponses({
  resourceName: 'Usuário',
  resourceNamePlural: 'Usuários',
  basePath: '/api/usuarios',
})
async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  // implementação
}
```

## Códigos de Status Documentados

Todos os decorators documentam automaticamente os seguintes códigos de status:

- **400**: Dados inválidos fornecidos
- **401**: Não autorizado
- **403**: Acesso negado
- **404**: Recurso não encontrado
- **409**: Conflito - Recurso já existe
- **500**: Erro interno do servidor
- **502**: Erro em serviço externo

## Vantagens

1. **Reutilização**: Um único decorator serve para qualquer módulo
2. **Consistência**: Todas as APIs seguem o mesmo padrão de documentação
3. **Manutenibilidade**: Mudanças nos decorators afetam todos os módulos
4. **Flexibilidade**: Configuração personalizada para cada recurso
5. **Documentação Automática**: Swagger gerado automaticamente com exemplos realistas

## Migração

Para migrar um controller existente:

1. Importe os decorators necessários
2. Substitua as múltiplas anotações `@ApiResponse` por um único decorator
3. Configure o `resourceName`, `resourceNamePlural` e `basePath` apropriados
4. Remova as anotações de erro manuais

**Antes:**

```typescript
@ApiResponse({ status: 401, description: 'Não autorizado' })
@ApiResponse({ status: 404, description: 'Categoria não encontrada' })
@ApiResponse({ status: 500, description: 'Erro interno do servidor' })
```

**Depois:**

```typescript
@ApiFindByIdErrorResponses({
  resourceName: 'Categoria',
  resourceNamePlural: 'Categorias',
  basePath: '/api/categorias',
})
```
