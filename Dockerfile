# ========================
# Build Stage
# ========================
FROM node:22-slim AS build
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm ci

# Copy all source files and build
COPY . .
RUN npm run build

# ========================
# DEV Stage
# ========================
FROM node:22-slim AS dev
WORKDIR /app

# Copy source and dependencies
COPY --from=build /app/src ./src
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig.json ./tsconfig.json
RUN npm ci

# Start NestJS in dev mode
CMD ["npm", "run", "start:dev"]

# ========================
# PROD Stage
# ========================
FROM node:22-slim AS prod
WORKDIR /app

# Copy built files and package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

# Start NestJS in production mode
CMD ["node", "dist/main"]
