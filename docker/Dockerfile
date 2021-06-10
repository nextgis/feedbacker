FROM alpine:3.13

WORKDIR /opt/feedbacker/src

RUN apk update && \
    apk add --no-cache nodejs nodejs-npm && \
    apk add --no-cache nginx

RUN mkdir -p /run/nginx

COPY ./docker/init.sh /opt/feedbacker/bin/init.sh
COPY ./docker/nginx.conf /etc/nginx/conf.d/feedbacker.conf
COPY ./ /opt/feedbacker/src

EXPOSE 8000