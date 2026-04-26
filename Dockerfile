FROM node:23-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:23-alpine AS production
WORKDIR /app
COPY package*.json ./
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm install
COPY tsconfig.json ./
COPY --from=build /app/dist ./dist
CMD ["sh", "-c", "npm run migration:run && npm run start:prod"]