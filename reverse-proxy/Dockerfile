FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/dts.conf
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

EXPOSE 80

CMD [ "./wait-for-it.sh", "file:3000", "--", "nginx", "-g", "daemon off;" ]