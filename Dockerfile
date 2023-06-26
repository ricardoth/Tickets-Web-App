FROM node:18.2.0-alpine as build-deps

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
