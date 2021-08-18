FROM node:12-alpine3.14 AS build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --only=production

FROM node:12-alpine3.14 AS run
WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY . ./
EXPOSE 1337
CMD ["node", "app"]
