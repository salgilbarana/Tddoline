const shortid   = require('shortid');
class Struct {
    constructor(sessId, userSrl, platformType, deviceId, clientVer, csvVer) {
        this.sessId         = sessId;
        this.userSrl        = userSrl;
        this.platformType   = platformType;
        this.deviceId       = deviceId;
        this.clientVer      = clientVer;
        this.csvVer         = csvVer;
    }
}

module.exports = class {
    constructor(parent) {
        this.Struct = Struct;
        this.parent = parent;
    }


    async exists(userSrl) {
        return await this.parent.db.hexists('session:'+userSrl, userSrl);
    }

    async existsSessId(sessId) {
        //this.parent._addLog('HEXISTS sessionBySessId:'+sessId, [sessId]);
        return await this.parent.db.hexists('sessionBySessId:'+sessId, sessId);
    }

    async remove(userSrl,sessId) { //expire 사용중
        this.parent._addLog('HDEL session:'+userSrl, [userSrl]);
        await this.parent.db.hdel('session:'+userSrl, userSrl);
        this.parent._addLog('HDEL sessionBySessId:'+sessId, [sessId]);
        await this.parent.db.hdel('sessionBySessId:'+sessId, sessId);
    }

    /** @return {Struct} */
    async get(userSrl) {
        this.parent._addLog('HGET session:'+userSrl, [userSrl]);
        let data = await this.parent.db.hget('session:'+userSrl, userSrl);
        return (data) ? JSON.parse(data) : null;
    }

    async getSessionTTL(userSrl){
        let data = await this.parent.db.ttl('session:'+userSrl);
        return (data) ? JSON.parse(data) : null;
    }

    async getUserSrlBySessId(sessId) {
        this.parent._addLog('HGET sessionBySessId:'+sessId, [sessId]);
        let data = await this.parent.db.hget('sessionBySessId:'+sessId, sessId);
        return (data) ? JSON.parse(data) : null;
    }

    async set(sessId, userSrl, platformType, deviceId, assetBundleVer, csvVer) {
        if(await this.exists(userSrl)){ // 이미 세션이 있는 상태에서 재 로그인시 기존 sessId를 제거
            let sess = await this.get(userSrl);
            this.parent._addLog('HDEL sessionBySessId:'+sess.sessId, [sess.sessId]);
            await this.parent.db.hdel('sessionBySessId:'+sess.sessId, sess.sessId);
        }
        let sess = JSON.stringify(new Struct(sessId, userSrl, platformType, deviceId, assetBundleVer, csvVer));

        this.parent._addLog('HSET session'+userSrl, [userSrl, sess]);
        this.parent._addLog('HSET sessionBySessId'+sessId, [sessId, userSrl]);

        await this.parent.db.hset('session:'+userSrl,userSrl, sess);
        await this.parent.db.expire('session:'+userSrl,60 * 60 * 4);
        //이곳에 랭킹 테스트 예정

        let sessionResult = await this.parent.db.hset('sessionBySessId:'+sessId,sessId, userSrl);
        await this.parent.db.expire('sessionBySessId:'+sessId,60 * 60 * 4);

        return sessionResult;
    }

    async sessionChange(sessId, userSrl, platformType, deviceId, assetBundleVer, csvVer){
        await this.remove(userSrl,sessId);                  //기존 세션 제거
        let nextSessId = shortid.generate();                 //세션 재생성
        let result = await this.set(nextSessId, userSrl, platformType, deviceId, assetBundleVer, csvVer);
        if(result === false)
            return await this.sessionChange(nextSessId, userSrl, platformType, deviceId, assetBundleVer, csvVer);
        else
            return nextSessId;
    }

    async refreshExpireDate(userSrl,sessId) {
        //sess.expireDate = Date.$nowSecs() + 60 * 60 * 6;
        //sess = JSON.stringify(sess);

        this.parent._addLog('EXPIRE session', [userSrl, sessId]);
        //await this.parent.db.hset('sessionById', id, sess);
        await this.parent.db.expire('session:'+userSrl,60 * 60 * 6);
        await this.parent.db.expire('sessionBySessId:'+sessId,60 * 60 * 6);
    }
};