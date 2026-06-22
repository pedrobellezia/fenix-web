# Etapa 1: Construção (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./
RUN npm ci

# Copia o restante do código do projeto
COPY . .

# Regenera o diretório .nuxt com o projeto completo disponível
RUN npx nuxi prepare

# Compila o projeto Nuxt para produção (gera a pasta independente '.output')
RUN npm run build

# Etapa 2: Execução (Runtime)
FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas os arquivos gerados no build (a pasta .output é auto-suficiente)
COPY --from=builder /app/.output ./.output

# Expõe a porta do container
EXPOSE 3000

# Executa o servidor integrado do Nuxt
CMD ["node", ".output/server/index.mjs"]
