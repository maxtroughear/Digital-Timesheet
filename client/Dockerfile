FROM node:lts as build

ENV SKIP_PREFLIGHT_CHECK true

ENV SCARF_ANALYTICS false

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --silent

COPY . /usr/src/app

ARG REACT_APP_API_URI
ENV REACT_APP_API_URI ${REACT_APP_API_URI}

ARG REACT_APP_BASE_DOMAIN
ENV REACT_APP_BASE_DOMAIN ${REACT_APP_BASE_DOMAIN}

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
