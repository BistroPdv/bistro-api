/**
 * Calcula os parâmetros de paginação para o Prisma
 * @param page Número da página (opcional)
 * @param limit Limite de itens por página (opcional)
 * @returns Objeto com skip e take calculados
 */
export function calculatePagination(page?: number, limit?: number) {
  // Skip: quantos registros pular
  const skip = page && limit ? (page - 1) * limit : 0;

  // Take: quantos registros retornar (undefined significa "todos")
  const take = limit || undefined;

  return { skip, take };
}

/**
 * Normaliza os valores de page e limit para a resposta
 * @param page Página atual
 * @param limit Limite por página
 * @param total Total de registros
 * @returns Valores normalizados para a resposta
 */
export function normalizePaginationResponse(
  page?: number,
  limit?: number,
  total?: number,
) {
  return {
    page: page || 1,
    limit: limit ?? total ?? 0,
  };
}
