FROM node:18-bullseye

RUN apt update
RUN apt install python3 python3-pip -y

WORKDIR /var/lib/coinfarm-vast-panel-collector
COPY ./src ./src
COPY ./.npmrc ./.npmrc
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY credentials.json credentials.json
COPY watchdog.sh watchdog.sh
COPY bin/ bin/

RUN npm install
RUN npm run build
RUN pip install requests

CMD ["npm", "run", "start:watchdog"]
