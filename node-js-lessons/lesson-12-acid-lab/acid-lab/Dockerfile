FROM node:20-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "start:dev"]

EXPOSE 3000