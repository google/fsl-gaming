FROM node:14-alpine

# Install certs and tools
RUN apk add curl

# Start
RUN mkdir -p /app
RUN mkdir -p /FSL-Backend-Common

COPY /FSL-Backend-Common /FSL-Backend-Common

WORKDIR /FSL-Backend-Common

RUN npm install

COPY /FSL-MS-Display-Leaderboard /app

WORKDIR /app

RUN npm install

EXPOSE 5013

CMD ["node", "index.js"]
