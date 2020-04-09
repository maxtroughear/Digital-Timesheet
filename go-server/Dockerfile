FROM golang:alpine AS build

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o server .

WORKDIR /dist

RUN cp /build/server .

FROM debian:buster-slim

COPY --from=build /dist/server /
COPY wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

CMD [ "./wait-for-it.sh", "db:5432", "--", "/server" ]