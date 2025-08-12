# Dockerfile para Bistro API com Prisma
# Multi-stage build para otimização

# Estágio de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências necessárias para o Prisma
RUN apk add --no-cache openssl

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia arquivos de configuração primeiro
COPY package.json pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN pnpm install --frozen-lockfile

# Copia o resto dos arquivos
COPY . .

# Gera o Prisma Client e faz o build do TypeScript
RUN pnpm prisma generate && pnpm run build

# Executa migrações e seeds diretamente no build
RUN pnpm prisma migrate deploy && pnpm prisma db seed

# Estágio de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instala dependências necessárias para o Prisma em produção
RUN apk add --no-cache openssl tzdata

# Define o timezone do sistema
ENV TZ=America/Sao_Paulo

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia apenas os arquivos necessários do estágio de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Expõe a porta 4000
EXPOSE 4000

# Define as variáveis de ambiente para produção
ENV NODE_ENV=production

# Comando de inicialização do container
CMD ["node", "dist/main"]
