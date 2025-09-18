FROM node:24-alpine AS base
WORKDIR /usr/app

FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM base AS production
RUN apk add --no-cache curl
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /usr/app/dist ./dist
CMD ["npm", "run", "start:prod"]
