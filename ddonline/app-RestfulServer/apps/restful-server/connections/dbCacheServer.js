const redis = require('ioredis');
const dbServerCfg = require('../_configs/dbCacheServer.json');

/** @type {redis} */
const db = (Array.isArray(dbServerCfg)) ? new redis.Cluster(dbServerCfg) : new redis(dbServerCfg);
// cluster 모드를 사용한다면 db select 를 사용할 수 없다.

//const db = new redis(dbServerCfg);
/*db.on('connect', () => {
    console.log('redis connect');
});
db.on('ready', () => {
    console.log('redis ready');
});
db.on('error', (err) => {
    console.log('redis error', err);
});
db.on('close', () => {
    console.log('redis close');
});
db.on('reconnecting', () => {
    console.log('redis reconnecting');
});
db.on('end', () => {
    console.log('redis end');
});*/

module.exports = db;