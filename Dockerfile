FROM node:22.6.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci --omit=dev

COPY ./src ./src
COPY ./assets ./assets

CMD ["npm", "run", "start"]
