# syntax=docker/dockerfile:1

############################
# Build stage
############################
FROM node:22-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @isac-chuab/financial-shared build
RUN pnpm --filter api build

# Gera node_modules isolado de PRODUÇÃO (legacy)
RUN pnpm --filter api deploy --prod --legacy /prod

############################
# Runtime stage
############################
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

# Copia runtime pronto
COPY --from=build /prod/node_modules ./node_modules
COPY --from=build /prod/package.json ./package.json
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/public ./public

EXPOSE 3000
CMD ["node", "dist/index.js"]
