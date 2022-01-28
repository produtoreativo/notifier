FROM node:14-alpine

WORKDIR /

RUN apk update
RUN apk add yarn --no-cache

COPY . .
RUN yarn install
RUN rm -rf ./build
RUN yarn build

EXPOSE 3100
CMD ["yarn", "start:prod"]