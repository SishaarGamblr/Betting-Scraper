FROM node:18 as build

RUN mkdir -p /app

FROM build AS development
WORKDIR /app
ENV NODE_ENV development
COPY . .
RUN npm run build
RUN npm install
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM build AS production
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json .
COPY --from=development /app/config ./config

RUN npm prune --production
CMD ["npm", "run", "start"]
