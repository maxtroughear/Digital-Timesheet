FROM golang:alpine AS build

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o main .

WORKDIR /dist

RUN cp /build/main .

FROM debian:buster-slim

COPY --from=build /dist/main /
# COPY wait-for-it.sh .
# RUN chmod +x ./wait-for-it.sh
# COPY access_control_model.conf .

# CMD [ "./wait-for-it.sh", "postgres:5432", "--", "/main" ]
CMD [ "/main" ]