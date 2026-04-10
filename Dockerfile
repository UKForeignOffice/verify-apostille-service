FROM node:24-alpine AS build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS run
WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY . ./
EXPOSE 1337
CMD ["node", "app"]
