# Dockerfile

FROM node:latest

WORKDIR /app

# from hw 18
RUN adduser -D sasha

COPY package.json package-lock.json ./

RUN npm install

COPY ./src .

EXPOSE 3000

# fron hw 18
USER sasha    

# ENV DOCKERIZE_VERSION v0.7.0

# RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#     && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# CMD dockerize -wait tcp://postgres:5432 -timeout 60m node app.js
CMD [ "node", "app.js" ]
