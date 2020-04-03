FROM node:lts-slim

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent

COPY . /usr/src/app

HEALTHCHECK NONE

CMD [ "npm", "start" ]
