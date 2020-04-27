const Const = require('uw-const');

class Struct {
    constructor() {
        this.srl = null;
        this.userSrl = 0;
        this.isProc = false;
        this.platformType = Const.PLATFORM_TYPES.NONE;
        this.trsId = null;
        this.marketSaleId  = 0;
        this.regTs = Date.$nowSecs();
    }
}

const Class = class {
    constructor(dbSrv) {
        this.Struct = Struct;
        this.dbSrv = dbSrv;
        this.isOpen = false;
        this.data = {};
    }

    open() {
        this.isOpen = true;
    }

    exists() {
        return this.isOpen;
    }

    setUserSrl(userSrl) {
        this.data.userSrl = userSrl;
    }
    setPlatformType(platformType) {
        this.data.platformType = platformType;
    }
    setTrsId(trsId) {
        this.data.trsId = trsId;
    }
    setMarketSaleId(marketSaleId) {
        this.data.marketSaleId = marketSaleId;
    }
    setIsProc(isProc) {
        this.data.isProc = isProc;
    }

    async insert() {
        let item = new Struct();
        item.$from(this.data);
        let db = await this.dbSrv.getShard();
        await db.insert('payments', item);
    }
};

Class.Struct = Struct;
module.exports = Class;
