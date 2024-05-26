FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine as production

WORKDIR /app

COPY package*.json .

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# Copy the assets folder
COPY ./assets ./assets

CMD [ "node", "dist/index.js" ]