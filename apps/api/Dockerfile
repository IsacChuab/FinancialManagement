# syntax=docker/dockerfile:1

############################
# Build stage
############################
FROM node:22-slim AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy package.json of projects
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

# Install ALL deps (including dev)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build TypeScript
RUN pnpm --filter @isac-chuab/financial-shared build
RUN pnpm --filter api build

# Generate production node_modules only for the api
RUN pnpm --filter api deploy --prod /prod

############################
# Runtime stage
############################
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only what is needed to run
COPY --from=build /prod/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
