#!/bin/sh

# Script de entrada para Docker com Prisma
# Executa migrações antes de iniciar a aplicação

set -e

echo "🚀 Iniciando Bistro API..."

# Aguardar conexão com o banco de dados
echo "⏳ Aguardando conexão com o banco de dados..."
until pnpm prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  echo "⏳ Banco de dados ainda não está disponível, aguardando..."
  sleep 2
done

echo "✅ Banco de dados conectado com sucesso!"

# Executar migrações do Prisma
echo "🔄 Executando migrações do Prisma..."
pnpm prisma migrate deploy

echo "✅ Migrações executadas com sucesso!"

# Gerar Prisma Client (caso necessário)
echo "🔧 Gerando Prisma Client..."
pnpm prisma generate

echo "✅ Prisma Client gerado com sucesso!"

# Verificar se o banco está sincronizado
echo "🔍 Verificando sincronização do banco..."
pnpm prisma db push --accept-data-loss

echo "✅ Banco de dados sincronizado!"

# Iniciar a aplicação
echo "🚀 Iniciando aplicação..."
exec "$@"
