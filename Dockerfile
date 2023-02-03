FROM node:18.12.1-alpine

RUN mkdir /root/.ssh

RUN mkdir -p /app/node_modules

WORKDIR /app

COPY . /app/

RUN npm install -y

EXPOSE 3333

CMD [ "sh" ]

# docker image build -f ./Dockerfile -t ably:local .
# docker run --name ably --privileged -d -it -p 3333:3333 -v $(pwd):/app ably:local
# docker exec -it ably sh
# node ace migration:run
# node ace serve