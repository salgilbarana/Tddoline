const mysql = require('basis-mysql'); //mysql 모듈 load
const dbGameCfgs = require('../_configs/dbGameServers.json'); //GameServer DB 설정 로드

const dbGameSrv = mysql.createService(); //생성자
dbGameCfgs.forEach(cfg => {
    dbGameSrv.addShard(cfg.shardId, cfg.masters, cfg.replicas); //mysql createService 함수에 DB 설정값 입력
});

module.exports = dbGameSrv; //dbGame 서버관련 모듈 정의