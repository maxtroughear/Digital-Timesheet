FROM node:lts

ARG REACT_APP_API_URI
ENV REACT_APP_API_URI $REACT_APP_API_URI

ENV SKIP_PREFLIGHT_CHECK true

ENV SCARF_ANALYTICS false

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent

COPY . /usr/src/app

HEALTHCHECK NONE

CMD [ "npm", "start" ]
