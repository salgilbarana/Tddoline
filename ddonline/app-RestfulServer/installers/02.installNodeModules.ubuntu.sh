#!/bin/bash

cd ${0%/*} > /dev/null 2>&1
cd ../  > /dev/null 2>&1

rootPath=${PWD}

if [ "$(whoami)" != "root" ]; then
    echo "Please run as sudo"
    exit
fi

packages="koa koa-sslify koa-router koa-bodyparser mysql2 ioredis ejs glob slash babyparse shortid uuid request request-promise-native node-cron"
su - ${SUDO_USER} -c "npm install --prefix ${rootPath} ${packages}"