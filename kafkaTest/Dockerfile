FROM node:16-alpine

COPY ./ ./
COPY ./package.json /usr/app/
COPY ./package-lock.json /usr/app/

WORKDIR /usr/app
RUN apk add git
RUN npm update
RUN npm ci