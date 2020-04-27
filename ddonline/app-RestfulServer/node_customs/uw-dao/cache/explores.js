class Struct {
    constructor(userSrl, characterSrl, mapId) {
        this.userSrl      = userSrl;
        this.characterSrl = characterSrl;
        this.mapId        = mapId;
        this.startTs      = Date.$nowSecs();
    }
}

module.exports = class {
    constructor(parent) {
        this.parent = parent;
    }

    async remove(userSrl) {
        this.parent._addLog('HDEL exploreByUserSrl', [userSrl]);
        await this.parent.db.hdel('exploreByUserSrl', userSrl);
    }

    /** @return {Struct} */
    async get(userSrl) {
        this.parent._addLog('HGET exploreByUserSrl', [userSrl]);
        let data = await this.parent.db.hget('exploreByUserSrl', userSrl);
        return (data) ? JSON.parse(data) : null;
    }

    async set(userSrl, characterSrl, mapId) {
        let row = JSON.stringify(new Struct(userSrl, characterSrl, mapId));
        this.parent._addLog('HSET exploreByUserSrl', [userSrl, row]);
        await this.parent.db.hset('exploreByUserSrl', userSrl, row);
    }
};