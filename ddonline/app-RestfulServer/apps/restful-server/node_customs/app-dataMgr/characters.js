const ExInvens = require('./exInvens');
const Structs   = require('app-structs');
const Const   = require('uw-const');
const CharacterStruct   = require('uw-dao/game/characters').Struct;

module.exports = class extends ExInvens {
    constructor() {
        super('characterId');
    }

    __getMaxCnt() {
        if (!this.dataMgr.isInit())
            return 0;

        let user = this.dataMgr.user.get();
        return user.characterInvenCnt;
    }
    async __getCntFromDb() {
        if (!this.dataMgr.isInit())
            return 0;

        let user = this.dataMgr.user.get();
        return await this.dataMgr.daoGame.characters.getCnt(user.srl);
    }
    async __getRowsFromDb(srls, ids) {
        if (!this.dataMgr.isInit())
            return [];

        let user = this.dataMgr.user.get();
        return await this.dataMgr.daoGame.characters.getsBySrlOrCharacterId(user.srl, srls, ids);
    }
    async __removeDbRows(srls) {
        if (!this.dataMgr.isInit())
            return;

        let user = this.dataMgr.user.get();
        await this.dataMgr.daoGame.characters.removes(user.srl, srls);
    }
    async __insertDbRows(rows) {
        if (!this.dataMgr.isInit())
            return;

        let user = this.dataMgr.user.get();
        await this.dataMgr.daoGame.characters.inserts(user.srl, rows);
    }
    async __modifyDbRows(rows) {
        if (!this.dataMgr.isInit())
            return;

        let user = this.dataMgr.user.get();
        for (let i=0; i<rows.length; i++)
            await this.dataMgr.daoGame.characters.update(user.srl, rows[i].srl, rows[i].onData);
    }

    /** @returns {Array.<CharacterStruct>} */
    async gets(filter) { return await super.gets(filter); }

    async add(characterId, exp) {
        if (!this.dataMgr.isInit())
            return;

        if (await this.isMax()) {
            this.dataMgr.newPosts.add(Const.REWARD_TYPES.CHARACTER, characterId, 1);
            this.dataMgr.newPosts.setIsOverStoragePost();
            return;
        }

        let user = this.dataMgr.user.get();
        super.add(new CharacterStruct(user.srl, id, exp));

        this.dataMgr.characterStamps.add(characterId);
    }
}