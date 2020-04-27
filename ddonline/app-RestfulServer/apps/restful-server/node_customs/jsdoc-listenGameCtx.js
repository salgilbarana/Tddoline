const Dao = require('uw-dao');
const Res = require('app-response');
const DataMgr = require('app-dataMgr');

/*
const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = class { //각 모듈 정의
    constructor() {
        this.$ = {
            daoGame : new Dao.Game,
            daoCache : new Dao.Cache,
            daoLog : new Dao.Log,
            res : new Res,
            dataMgr : new DataMgr,
            sess : new Dao.Cache.prototype.sessions.Struct
        }
    }
};