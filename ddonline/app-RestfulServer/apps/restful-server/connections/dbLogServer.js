const mysql = require('basis-mysql');
const cfg = require('../_configs/dbLogServer.json');

const dbGameSrv = mysql.createService();
dbGameSrv.addShard(cfg.shardId, cfg.masters, cfg.replicas);

module.exports = dbGameSrv;