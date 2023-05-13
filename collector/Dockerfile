FROM node:18-bullseye

WORKDIR /var/lib/coinfarm-vast-panel-collector
COPY ./src ./src
COPY ./.npmrc ./.npmrc
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY credentials.json credentials.json
COPY watchdog.sh watchdog.sh

RUN npm install
RUN npm run build

CMD ["npm", "run", "start:watchdog"]
