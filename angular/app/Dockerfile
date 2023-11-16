ARG DOCKER_HUB="docker.io"
ARG NGINX_VERSION="1.17.6"
ARG NODE_VERSION="21-alpine"

FROM $DOCKER_HUB/library/node:$NODE_VERSION

WORKDIR /home/app/frontend

ENV PATH /home/app/frontend/node_modules/.bin:$PATH

COPY ./package.json /home/app/frontend/package.json
RUN npm install
RUN npm install -g @angular/cli@latest

EXPOSE 4200 49153
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000", "--port", "4200", "--disable-host-check"]