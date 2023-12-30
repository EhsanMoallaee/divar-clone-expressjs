FROM node:20

LABEL authors="Ehsan Moallee"

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install 

COPY . /app

EXPOSE 3000

CMD [ "node", "main.js" ]