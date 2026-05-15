# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Force development mode so npm ci installs devDependencies (typescript, @types/*)
# Coolify injects NODE_ENV=production as a build ARG which would skip devDeps
ENV NODE_ENV=development

# Install ALL dependencies (including devDependencies for tsc)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source & config
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled output and prisma files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

EXPOSE 3000

# Run DB migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
