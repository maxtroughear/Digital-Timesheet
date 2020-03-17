FROM node:lts-slim

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG MONGO_URI
ENV MONGO_URI $MONGO_URI

ARG SECRET_KEY
ENV SECRET_KEY $SECRET_KEY

COPY package.json /usr/src/app/
RUN npm install --silent

COPY . /usr/src/app

ENV PORT 3000
EXPOSE $PORT
CMD [ "npm", "start" ]
