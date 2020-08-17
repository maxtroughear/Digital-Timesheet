FROM node:lts

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent

COPY . /usr/src/app

CMD [ "npm", "start" ]
