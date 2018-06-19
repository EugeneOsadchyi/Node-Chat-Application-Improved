FROM node:10.4-alpine

RUN apk add --update yarn

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile --production && yarn cache clean

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
