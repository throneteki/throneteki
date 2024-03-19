FROM node:16

RUN mkdir -p /app/node
WORKDIR /app/node

ARG VERSION
ENV VERSION ${VERSION}

COPY package.json /app/node/
COPY package-lock.json /app/node/

RUN npm install
COPY . /app/node

CMD [ "npm", "run", "gamenode" ]