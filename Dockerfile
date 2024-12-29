FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm install
COPY tsconfig.json ./
EXPOSE 5000
CMD ["npm run start:prod"]