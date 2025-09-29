import { Prisma } from '@prisma/client';
import {
  BusinessErrorCode,
  BusinessException,
} from '../exceptions/business.exception';

/**
 * Utilitário para tratamento padronizado de erros
 */
export class ErrorHandler {
  /**
   * Trata erros do Prisma e converte para BusinessException
   */
  static handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw BusinessException.alreadyExists(
            'Registro',
            error.meta?.target as string,
          );
        case 'P2025':
          throw BusinessException.notFound('Registro');
        case 'P2003':
          throw new BusinessException(
            'Não é possível excluir ou modificar devido a uma referência em outro registro',
            BusinessErrorCode.OPERATION_NOT_ALLOWED,
          );
        default:
          throw BusinessException.internalError('Erro no banco de dados');
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw BusinessException.validation('Dados inválidos fornecidos');
    }

    throw BusinessException.internalError('Erro interno do servidor');
  }

  /**
   * Wrapper para operações que podem falhar
   */
  static async execute<T>(
    operation: () => Promise<T>,
    errorMessage?: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError
      ) {
        this.handlePrismaError(error);
      }

      throw BusinessException.internalError(
        errorMessage || 'Erro interno do servidor',
      );
    }
  }

  /**
   * Valida se um recurso existe
   */
  static validateResourceExists<T>(
    resource: T | null,
    resourceName: string,
  ): asserts resource is T {
    if (!resource) {
      throw BusinessException.notFound(resourceName);
    }
  }

  /**
   * Valida dados obrigatórios
   */
  static validateRequired(data: any, fieldName: string, value?: any): void {
    if (value === undefined || value === null || value === '') {
      throw BusinessException.validation(`O campo ${fieldName} é obrigatório`, [
        `${fieldName} é obrigatório`,
      ]);
    }
  }

  /**
   * Valida formato de email
   */
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw BusinessException.validation('Formato de email inválido', [
        'Email deve ter formato válido',
      ]);
    }
  }

  /**
   * Valida CNPJ
   */
  static validateCNPJ(cnpj: string): void {
    // Remove caracteres não numéricos
    const cleanCNPJ = cnpj.replace(/\D/g, '');

    if (cleanCNPJ.length !== 14) {
      throw BusinessException.validation('CNPJ deve ter 14 dígitos', [
        'CNPJ deve ter 14 dígitos numéricos',
      ]);
    }

    // Validação básica de CNPJ (algoritmo)
    if (this.isCNPJValid(cleanCNPJ)) {
      throw BusinessException.validation('CNPJ inválido', [
        'CNPJ não é válido',
      ]);
    }
  }

  private static isCNPJValid(cnpj: string): boolean {
    // Implementação simplificada da validação de CNPJ
    // Em produção, usar uma biblioteca específica
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const digits = cnpj.split('').map(Number);

    // Verifica se todos os dígitos são iguais
    if (digits.every((digit) => digit === digits[0])) {
      return false;
    }

    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights1[i];
    }
    const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weights2[i];
    }
    const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    return digits[12] === digit1 && digits[13] === digit2;
  }
}
