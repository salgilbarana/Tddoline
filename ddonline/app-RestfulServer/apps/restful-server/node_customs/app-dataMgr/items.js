const ExInvens = require('./exInvens');

module.exports = class extends ExInvens {
    constructor() {
        super('itemId');
    }
    __getMaxCnt() { return 0; }
    async __getCntFromDb() { return 0; }
    async __getRowsFromDb(srls, ids) {
        if (!this.dataMgr.isInit())
            return [];

        let user = this.dataMgr.user.get();
        return await this.dataMgr.daoGame.items.getsBySrlsOrIds(user.srl, srls, ids);
    }
    async __removeDbRows(srls) {}
    async __insertDbRows(rows) {}
    async __modifyDbRows(rows) {}
};