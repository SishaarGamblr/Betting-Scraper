FROM node:16 as build

RUN mkdir -p /app
WORKDIR /app

FROM build AS development
ENV NODE_ENV development
COPY . .
RUN npm run build

FROM build AS production
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json .
COPY --from=development /app/config ./config

RUN npm prune --production

