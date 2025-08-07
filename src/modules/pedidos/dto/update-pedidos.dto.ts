import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { StatusPedido, StatusProduto } from './create-pedidos.dto';
import {
  PEDIDOS_DEFAULTS,
  PEDIDOS_ERROR_MESSAGES,
  PEDIDOS_LIMITS,
  PEDIDOS_VALIDATION_CONFIG,
} from './pedidos.constants';

export class UpdateAdicionalDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: `ID do adicional selecionado (UUID obrigatório)`,
    required: true,
    minLength: PEDIDOS_LIMITS.UUID_LENGTH,
    maxLength: PEDIDOS_LIMITS.UUID_LENGTH,
  })
  @IsNotEmpty({ message: PEDIDOS_ERROR_MESSAGES.ADICIONAL_ID_OBRIGATORIO })
  @IsUUID(PEDIDOS_VALIDATION_CONFIG.UUID_VERSION, {
    message: PEDIDOS_ERROR_MESSAGES.ADICIONAL_ID_UUID_INVALIDO,
  })
  id: string;

  @ApiProperty({
    example: 'COD123',
    description: `Código de integração do adicional (opcional, máximo ${PEDIDOS_LIMITS.MAX_LENGTH_CODIGO_INTEGRACAO} caracteres)`,
    required: false,
    maxLength: PEDIDOS_LIMITS.MAX_LENGTH_CODIGO_INTEGRACAO,
  })
  @IsOptional()
  @IsString({ message: PEDIDOS_ERROR_MESSAGES.CODIGO_INTEGRACAO_STRING })
  @Max(PEDIDOS_LIMITS.MAX_LENGTH_CODIGO_INTEGRACAO, {
    message: PEDIDOS_ERROR_MESSAGES.CODIGO_INTEGRACAO_MAX,
  })
  codIntegra?: string;

  @ApiProperty({
    example: 2,
    description: `Quantidade do adicional (obrigatório, mínimo ${PEDIDOS_LIMITS.MIN_QUANTIDADE_ADICIONAL}, máximo ${PEDIDOS_LIMITS.MAX_QUANTIDADE_ADICIONAL})`,
    required: true,
    minimum: PEDIDOS_LIMITS.MIN_QUANTIDADE_ADICIONAL,
    maximum: PEDIDOS_LIMITS.MAX_QUANTIDADE_ADICIONAL,
  })
  @IsNotEmpty({
    message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_ADICIONAL_OBRIGATORIA,
  })
  @IsNumber({}, { message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_ADICIONAL_NUMERO })
  @IsPositive({ message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_ADICIONAL_POSITIVA })
  @Min(PEDIDOS_LIMITS.MIN_QUANTIDADE_ADICIONAL, {
    message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_ADICIONAL_MIN,
  })
  @Max(PEDIDOS_LIMITS.MAX_QUANTIDADE_ADICIONAL, {
    message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_ADICIONAL_MAX,
  })
  quantidade: number;

  @ApiProperty({
    example: 5.5,
    description: `Preço unitário do adicional (obrigatório, mínimo ${PEDIDOS_LIMITS.MIN_PRECO}, máximo ${PEDIDOS_LIMITS.MAX_PRECO})`,
    required: true,
    minimum: PEDIDOS_LIMITS.MIN_PRECO,
    maximum: PEDIDOS_LIMITS.MAX_PRECO,
  })
  @IsNotEmpty({ message: PEDIDOS_ERROR_MESSAGES.PRECO_ADICIONAL_OBRIGATORIO })
  @IsNumber({}, { message: PEDIDOS_ERROR_MESSAGES.PRECO_ADICIONAL_NUMERO })
  @Min(PEDIDOS_LIMITS.MIN_PRECO, {
    message: PEDIDOS_ERROR_MESSAGES.PRECO_ADICIONAL_MIN,
  })
  @Max(PEDIDOS_LIMITS.MAX_PRECO, {
    message: PEDIDOS_ERROR_MESSAGES.PRECO_ADICIONAL_MAX,
  })
  price: number;
}

export class UpdateProdutoPedidoDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: `ID do produto selecionado (UUID obrigatório)`,
    required: true,
    minLength: PEDIDOS_LIMITS.UUID_LENGTH,
    maxLength: PEDIDOS_LIMITS.UUID_LENGTH,
  })
  @IsNotEmpty({ message: PEDIDOS_ERROR_MESSAGES.PRODUTO_ID_OBRIGATORIO })
  @IsUUID(PEDIDOS_VALIDATION_CONFIG.UUID_VERSION, {
    message: PEDIDOS_ERROR_MESSAGES.PRODUTO_ID_UUID_INVALIDO,
  })
  produtoId: string;

  @ApiProperty({
    example: 'PROD123',
    description: `ID externo do produto para integração com sistemas externos (opcional, máximo ${PEDIDOS_LIMITS.MAX_LENGTH_EXTERNO_ID} caracteres)`,
    required: false,
    maxLength: PEDIDOS_LIMITS.MAX_LENGTH_EXTERNO_ID,
  })
  @IsOptional()
  @IsString({ message: PEDIDOS_ERROR_MESSAGES.EXTERNO_ID_STRING })
  @Max(PEDIDOS_LIMITS.MAX_LENGTH_EXTERNO_ID, {
    message: PEDIDOS_ERROR_MESSAGES.EXTERNO_ID_MAX,
  })
  externoId?: string;

  @ApiProperty({
    example: 'Sem cebola, por favor',
    description: `Observações específicas para o produto (opcional, máximo ${PEDIDOS_LIMITS.MAX_LENGTH_OBSERVACAO} caracteres)`,
    required: false,
    maxLength: PEDIDOS_LIMITS.MAX_LENGTH_OBSERVACAO,
  })
  @IsOptional()
  @IsString({ message: PEDIDOS_ERROR_MESSAGES.OBS_STRING })
  @Max(PEDIDOS_LIMITS.MAX_LENGTH_OBSERVACAO, {
    message: PEDIDOS_ERROR_MESSAGES.OBS_MAX,
  })
  obs?: string;

  @ApiProperty({
    example: StatusProduto.AGUARDANDO,
    description: `Status do produto no pedido (opcional, padrão: ${PEDIDOS_DEFAULTS.STATUS_PRODUTO})`,
    enum: StatusProduto,
    default: PEDIDOS_DEFAULTS.STATUS_PRODUTO,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusProduto, {
    message: PEDIDOS_ERROR_MESSAGES.STATUS_PRODUTO_VALIDO,
  })
  status?: StatusProduto;

  @ApiProperty({
    example: 2,
    description: `Quantidade do produto (obrigatório, mínimo ${PEDIDOS_LIMITS.MIN_QUANTIDADE_PRODUTO}, máximo ${PEDIDOS_LIMITS.MAX_QUANTIDADE_PRODUTO})`,
    required: true,
    minimum: PEDIDOS_LIMITS.MIN_QUANTIDADE_PRODUTO,
    maximum: PEDIDOS_LIMITS.MAX_QUANTIDADE_PRODUTO,
  })
  @IsNotEmpty({
    message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_PRODUTO_OBRIGATORIA,
  })
  @IsNumber({}, { message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_PRODUTO_NUMERO })
  @IsPositive({ message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_PRODUTO_POSITIVA })
  @Min(PEDIDOS_LIMITS.MIN_QUANTIDADE_PRODUTO, {
    message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_PRODUTO_MIN,
  })
  @Max(PEDIDOS_LIMITS.MAX_QUANTIDADE_PRODUTO, {
    message: PEDIDOS_ERROR_MESSAGES.QUANTIDADE_PRODUTO_MAX,
  })
  quantidade: number;

  @ApiProperty({
    example: true,
    description: `Se deve gerar cupom fiscal para este produto (opcional, padrão: ${PEDIDOS_DEFAULTS.CUPOM_FISCAL})`,
    default: PEDIDOS_DEFAULTS.CUPOM_FISCAL,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: PEDIDOS_ERROR_MESSAGES.CUPOM_FISCAL_BOOLEAN })
  cupom_fiscal?: boolean;

  @ApiProperty({
    type: [UpdateAdicionalDto],
    description: `Lista de adicionais selecionados para o produto (opcional, máximo ${PEDIDOS_LIMITS.MAX_ADICIONAIS_POR_PRODUTO} adicionais)`,
    required: false,
    isArray: true,
    maxItems: PEDIDOS_LIMITS.MAX_ADICIONAIS_POR_PRODUTO,
  })
  @IsOptional()
  @IsArray({ message: PEDIDOS_ERROR_MESSAGES.ADICIONAIS_ARRAY })
  @ValidateNested({
    each: true,
    message: PEDIDOS_ERROR_MESSAGES.ADICIONAIS_VALIDO,
  })
  @Type(() => UpdateAdicionalDto)
  adicionais?: UpdateAdicionalDto[];
}

export class UpdatePedidosDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: `ID do pedido a ser atualizado (UUID obrigatório)`,
    required: true,
    minLength: PEDIDOS_LIMITS.UUID_LENGTH,
    maxLength: PEDIDOS_LIMITS.UUID_LENGTH,
  })
  @IsNotEmpty({ message: 'ID do pedido é obrigatório' })
  @IsUUID(PEDIDOS_VALIDATION_CONFIG.UUID_VERSION, {
    message: 'ID do pedido deve ser um UUID válido',
  })
  id: string;

  @ApiProperty({
    example: StatusPedido.FINALIZADO,
    description: `Novo status do pedido (opcional)`,
    enum: StatusPedido,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusPedido, {
    message: PEDIDOS_ERROR_MESSAGES.STATUS_PEDIDO_VALIDO,
  })
  status?: StatusPedido;

  @ApiProperty({
    example: 'PED123456',
    description: `Código do pedido no sistema PDV (opcional, máximo ${PEDIDOS_LIMITS.MAX_LENGTH_PDV_CODIGO} caracteres)`,
    required: false,
    maxLength: PEDIDOS_LIMITS.MAX_LENGTH_PDV_CODIGO,
  })
  @IsOptional()
  @IsString({ message: PEDIDOS_ERROR_MESSAGES.PDV_CODIGO_STRING })
  @Max(PEDIDOS_LIMITS.MAX_LENGTH_PDV_CODIGO, {
    message: PEDIDOS_ERROR_MESSAGES.PDV_CODIGO_MAX,
  })
  pdvCodPedido?: string;

  @ApiProperty({
    example: 'Cliente solicitou cancelamento',
    description: `Motivo do cancelamento (opcional, máximo ${PEDIDOS_LIMITS.MAX_LENGTH_MOTIVO_CANCELAMENTO} caracteres, apenas quando status for CANCELADO)`,
    required: false,
    maxLength: PEDIDOS_LIMITS.MAX_LENGTH_MOTIVO_CANCELAMENTO,
  })
  @IsOptional()
  @IsString({ message: PEDIDOS_ERROR_MESSAGES.MOTIVO_STRING })
  @Max(PEDIDOS_LIMITS.MAX_LENGTH_MOTIVO_CANCELAMENTO, {
    message: PEDIDOS_ERROR_MESSAGES.MOTIVO_MAX,
  })
  motivoCancelamento?: string;

  @ApiProperty({
    type: [UpdateProdutoPedidoDto],
    description: `Lista atualizada de produtos do pedido (opcional, máximo ${PEDIDOS_LIMITS.MAX_PRODUTOS_POR_PEDIDO} produtos)`,
    required: false,
    isArray: true,
    maxItems: PEDIDOS_LIMITS.MAX_PRODUTOS_POR_PEDIDO,
    examples: {
      'Atualização Simples': {
        summary: 'Atualizar apenas o status do pedido',
        value: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'FINALIZADO',
        },
      },
      'Atualização Completa': {
        summary: 'Atualizar pedido com novos produtos',
        value: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'FINALIZADO',
          pdvCodPedido: 'PED123456',
          produtos: [
            {
              produtoId: '550e8400-e29b-41d4-a716-446655440000',
              quantidade: 2,
              status: 'PRONTO',
              adicionais: [
                {
                  id: '550e8400-e29b-41d4-a716-446655440000',
                  quantidade: 1,
                  price: 5.5,
                },
              ],
            },
          ],
        },
      },
      Cancelamento: {
        summary: 'Cancelar pedido com motivo',
        value: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'CANCELADO',
          motivoCancelamento: 'Cliente solicitou cancelamento',
        },
      },
    },
  })
  @IsOptional()
  @IsArray({ message: PEDIDOS_ERROR_MESSAGES.PRODUTOS_ARRAY })
  @ValidateNested({
    each: true,
    message: PEDIDOS_ERROR_MESSAGES.PRODUTO_VALIDO,
  })
  @Type(() => UpdateProdutoPedidoDto)
  produtos?: UpdateProdutoPedidoDto[];
}
