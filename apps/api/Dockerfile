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
RUN pnpm --filter @isac-chuab/financial-shared build \
 && pnpm --filter api build


############################
# Runtime stage
############################
FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only what is needed to run
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json

# Install only production deps of the API
RUN pnpm install --prod --filter api...

EXPOSE 3000
CMD ["node", "dist/index.js"]
