FROM node:latest

WORKDIR usr/src/app

COPY . /app

COPY package*.json ./

RUN npm install

ENV DOCKERIZE_VERSION v0.6.1

EXPOSE 1230

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \

    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \

    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENTRYPOINT ["dockerize", "-wait", "tcp://app_mysql:3306", "-timeout", "20s"]

CMD [“npm”, "run", “start”]

