FROM node:18.17.1-alpine

LABEL description="Wiki Docker image"

RUN apk add g++ make cmake python3 --no-cache

WORKDIR /wiki
COPY . .
RUN yarn install
RUN yarn build
RUN yarn --production --frozen-lockfile --non-interactive

CMD yarn start
