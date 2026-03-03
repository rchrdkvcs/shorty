FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS production-deps
RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

FROM base AS build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN node ace build --ignore-ts-errors

FROM base AS production
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app

EXPOSE 80
CMD ["node", "./bin/server.js"]
