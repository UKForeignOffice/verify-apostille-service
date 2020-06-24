# base image
FROM node:12

ADD package.json /tmp/package.json
RUN cd /tmp && npm install && \
    mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3002
ENV NODE_ENV production
CMD [ "node", "app","3002" ]
