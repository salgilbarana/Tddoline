const Const     = require('uw-const');
const CsvMgr    = require('uw-csvMgr');

const DataMgr = require('app-dataMgr');
const UserStruct   = require('uw-dao/game/userInfo').Struct;

module.exports = class {
    constructor() {
        /** @type {DataMgr} */
        this.dataMgr = null;

        /** @type {UserStruct} */
        this.user = null;
        this.originUser = null;
    }

    setDataMgr(dataMgr) {
        this.dataMgr = dataMgr;
    }

    isInit() {
        return (this.user !== null);
    }

    fixMaxGold(user){ //골드 들어온것에 대한 최대값 세팅
        if(user.gold > CsvMgr.global.MAX_GOLD)
            user.gold = CsvMgr.global.MAX_GOLD;
        return user;
    }

    set(user) {
        this.user = user;
        this.originUser = user.$copy();
    }

    get() {
        return this.user;
    }

    getMaxInventoryCnt() {
        if (!this.isInit())
            return 0;

        if (!CsvMgr.inventoryLevels.exists(this.user.inventoryLevel))
            return 0;

        let inventoryLevelCsv = CsvMgr.inventoryLevels.get(this.user.inventoryLevel);
        return inventoryLevelCsv.maxCount;
    }


    isNotEnoughResource() {
        if (this.user['gold'] < 0)
            return true;
        if (this.user['ruby'] < 0)
            return true;
        return false;
    }

    diff() {
        if (!this.isInit())
            return null;

        return this.user.$diff(this.originUser);
    }

    async saveDb() {
        if (!this.isInit())
            return null;

        let diff = this.diff();
        if (!diff)
            return null;
        if(diff.gold)
            this.fixMaxGold(diff);

        await this.dataMgr.daoGame.userInfo.update(this.user.srl, diff);

        this.originUser = this.user.$copy();
        return diff;
    }

};