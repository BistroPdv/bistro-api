# Dockerfile para Bistro API com Prisma
# Multi-stage build para otimização

# Stage 1: Dependências de desenvolvimento
FROM node:18-alpine AS deps
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar todas as dependências (incluindo devDependencies)
RUN pnpm install --frozen-lockfile

# Stage 2: Build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar Prisma Client
RUN pnpm prisma generate

# Build da aplicação
RUN pnpm run build

# Stage 3: Produção
FROM node:18-alpine AS runner
WORKDIR /app

# Instalar dependências necessárias para produção
RUN apk add --no-cache dumb-init

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar dependências de produção E devDependencies necessárias para Prisma
RUN pnpm install --frozen-lockfile

# Copiar Prisma schema e migrations
COPY --from=builder /app/prisma ./prisma

# Copiar arquivos buildados
COPY --from=builder /app/dist ./dist

# Copiar assets se necessário
COPY --from=builder /app/src/assets ./src/assets

# Gerar Prisma Client na imagem de produção
RUN pnpm prisma generate

# Script de inicialização com Prisma
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Definir permissões corretas
RUN chown -R nestjs:nodejs /app

# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/main"]
