FROM node:24-alpine AS build
WORKDIR /opt/app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS run
WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY . ./
RUN find /opt/app -type f \( \
  -name "package-lock.json" -o \
  -name "Gemfile.lock" -o \
  -name "npm-shrinkwrap.json" -o \
  -name "yarn.lock" -o \
  -name "pnpm-lock.yaml" \
\) -delete
EXPOSE 1337
CMD ["node", "app"]
