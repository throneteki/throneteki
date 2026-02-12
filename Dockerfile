FROM --platform=linux/amd64 node:20

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install

ARG VERSION
ARG SENTRY_KEY
ARG SENTRY_AUTH_TOKEN
ARG HCAPTCHA_SITE_KEY
ENV VERSION ${VERSION}
ENV VITE_VERSION ${VERSION}
ENV VITE_SENTRY_KEY ${SENTRY_KEY}
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}
ENV VITE_HCAPTCHA_SITE_KEY ${HCAPTCHA_SITE_KEY}

ENV NODE_ENV production

COPY . /usr/src/app

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

CMD [ "node", "." ]
