# Stage 1: Build the server
FROM node:20-alpine AS server-build

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source code
COPY . .

# Build server bundle
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --silent && npm cache clean --force

# Copy built server code
COPY --from=server-build /app/../dist/server ./dist/server

# Copy client build artifacts from client-build stage (referenced in docker-compose)
# These are provided via docker-compose build context or multi-stage references
COPY --from=client-build /app/dist/client ./public
COPY --from=client-build /app/static ./static

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/server/index.js"]
