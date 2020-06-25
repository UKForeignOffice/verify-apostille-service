# base image
FROM node:12.18.1-alpine3.11

ADD package.json /tmp/package.json
RUN cd /tmp && npm install && \
    mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 1337
ENV NODE_ENV production
CMD [ "node", "app" ]
