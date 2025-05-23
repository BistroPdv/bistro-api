import { Prisma } from '@prisma/client';

interface BuildWhereOptions {
  search?: Record<string, string>;
  cnpj?: string;
  includeDeleted?: boolean;
  additionalFilters?: Record<string, any>;
}

/**
 * Constrói um objeto WHERE para queries do Prisma de forma padronizada.
 * Funciona para qualquer modelo do Prisma.
 *
 * @param options Opções para construção da query
 * @returns Objeto WHERE do Prisma tipado
 *
 * @example
 * // Para usuários
 * const userWhere = buildPrismaWhere<Prisma.UserWhereInput>({ search, cnpj });
 *
 * // Para produtos
 * const productWhere = buildPrismaWhere<Prisma.ProdutoWhereInput>({ search, cnpj });
 *
 * // Para categorias
 * const categoryWhere = buildPrismaWhere<Prisma.CategoriaWhereInput>({ search, cnpj });
 *
 * // Com filtros adicionais
 * const orderWhere = buildPrismaWhere<Prisma.PedidoWhereInput>({
 *   search,
 *   cnpj,
 *   additionalFilters: { status: 'PENDING' }
 * });
 */
export function buildPrismaWhere<T = any>(options: BuildWhereOptions = {}): T {
  const {
    search,
    cnpj,
    includeDeleted = false,
    additionalFilters = {},
  } = options;

  let where: any = {
    ...additionalFilters,
  };

  // Adiciona filtro de soft delete se não incluir deletados
  if (!includeDeleted) {
    where.delete = false;
  }

  // Adiciona filtro de restaurante por CNPJ se fornecido
  if (cnpj) {
    where.restaurant = { cnpj };
  }

  // Adiciona filtros de busca dinâmica
  if (search && Object.keys(search).length > 0) {
    const searchFilters = Object.keys(search).reduce(
      (acc, key) => {
        acc[key] = {
          contains: search[key],
          mode: 'insensitive' as Prisma.QueryMode,
        };
        return acc;
      },
      {} as Record<string, any>,
    );

    where = { ...where, ...searchFilters };
  }

  return where as T;
}

/**
 * Versão simplificada para casos comuns (apenas search e cnpj).
 * Funciona para qualquer modelo do Prisma.
 *
 * @param search Filtros de busca dinâmica
 * @param cnpj CNPJ do restaurante
 * @returns Objeto WHERE do Prisma tipado
 *
 * @example
 * // Para qualquer modelo
 * const userWhere = buildWhere<Prisma.UserWhereInput>(search, cnpj);
 * const productWhere = buildWhere<Prisma.ProdutoWhereInput>(search, cnpj);
 * const categoryWhere = buildWhere<Prisma.CategoriaWhereInput>(search, cnpj);
 */
export function buildWhere<T = any>(
  search?: Record<string, string>,
  cnpj?: string,
): T {
  return buildPrismaWhere<T>({ search, cnpj });
}
