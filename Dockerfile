# build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# production
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/docker-entrypoint.sh /docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT [ "sh", "/docker-entrypoint.sh" ]