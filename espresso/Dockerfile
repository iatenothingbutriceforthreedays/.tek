FROM node:14.9-alpine3.11

ENV NODE_ENV=production

WORKDIR /espresso

COPY package.json package-lock.json ./

RUN npm ci

RUN npm run build

USER node

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
