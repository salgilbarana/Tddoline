const Koa = require('koa');
const fs = require('fs');
const http = require('http');
//const https = require('https');

const koaBodyParser = require('koa-bodyparser');
const koaSslify = require('koa-sslify');
//const KoaTimeout = require('koa-better-timeout');
const koaEventHandler = require('basis-koa/event-handler');
const koaAutoRouter = require('basis-koa/auto-router');

module.exports = async(port) => {
    const koa = new Koa();
    
    koa.silent = true;
    koa.use(koaBodyParser({
        formLimit : '500kb'
    }));
    koa.use(koaEventHandler({
        onConnect : require('./events/onConnect.js'),
        onError : require('./events/onError.js'),
        onClose : require('./events/onClose.js')
    }));
    koa.use(koaAutoRouter(__dirname + '/routes'));
    console.log(__dirname);
    http.createServer(koa.callback()).listen(port);

    //https use
    /*https.createServer({
        key : fs.readFileSync(''),
        cert : fs.readFileSync('')
    }, app.callback()).listen(2001);*/    
};