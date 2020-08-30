FROM node:14.9-alpine3.11

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY tsconfig.json /app

RUN npm ci

COPY ./src /app/src

RUN npm run build

USER node

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
