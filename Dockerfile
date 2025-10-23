# Build 
FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# DEV
FROM node:22-slim AS dev
WORKDIR /app

COPY --from=build /app/src ./src
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig.json ./tsconfig.json
RUN npm ci

CMD ["npm", "run", "start:dev"]

# PROD
FROM node:22-slim AS prod
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev

CMD ["node", "dist/main"]
