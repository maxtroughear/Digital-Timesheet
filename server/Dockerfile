FROM node:slim

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG MONGO_URI
ENV MONGO_URI $MONGO_URI

ARG REDIS_HOST
ENV REDIS_HOST $REDIS_HOST

ARG SECRET_TOKEN_KEY
ENV SECRET_TOKEN_KEY $SECRET_TOKEN_KEY

ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent

RUN npm install pm2 -g

COPY . /usr/src/app

#CMD [ "npm", "start" ]
CMD [ "pm2-runtime", "ecosystem.config.js", "-i", "2" ]