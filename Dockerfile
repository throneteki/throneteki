FROM node:16 as base

RUN mkdir -p /usr/src/lobby
WORKDIR /usr/src/lobby
COPY package.json /usr/src/lobby/
COPY package-lock.json /usr/src/lobby/
RUN npm install

ARG VERSION
ENV VERSION ${VERSION}

COPY . /usr/src/lobby

FROM node:16 as client

ARG VERSION
ENV VERSION ${VERSION}

WORKDIR /app

RUN git clone https://github.com/throneteki/throneteki-client.git

WORKDIR /app/throneteki-client

RUN echo ${VERSION}

RUN npm install
RUN npm run build

FROM base as final

WORKDIR /app/lobby

COPY --from=base /usr/src/lobby .
COPY --from=client /app/throneteki-client/dist ./public
COPY --from=client /app/throneteki-client/assets ./public

RUN rm -rf /usr/src/lobby

CMD [ "npm", "start" ]