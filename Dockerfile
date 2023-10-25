FROM node:18.15.0-alpine

RUN apk upgrade -U && \ 
    apk add \
        build-base=0.5-r3 \
        ffmpeg=5.1.2-r1 \
        wget=1.21.3-r2 \
        libtool=2.4.7-r1 \
        autoconf=2.71-r1 \
        automake=1.16.5-r1 \
        python3=3.10.10-r0 && \
    rm -rf /var/cache/* && \
    wget -O /tmp/libsodium-1.0.18-stable.tar.gz https://download.libsodium.org/libsodium/releases/libsodium-1.0.18-stable.tar.gz && \
    tar -xf /tmp/libsodium-1.0.18-stable.tar.gz -C /tmp/ && \
    cd /tmp/libsodium-stable && \
    ./configure && \
    make && \
    make check && \
    make install && \
    rm -rf /tmp/*

ENV NODE_ENV=development

WORKDIR /app

COPY . .

RUN npm i --quiet