FROM node:22-alpine AS build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:22-alpine AS run
WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY . ./
EXPOSE 1337
CMD ["node", "app"]
