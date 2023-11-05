FROM node:18-buster-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install 

COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]

