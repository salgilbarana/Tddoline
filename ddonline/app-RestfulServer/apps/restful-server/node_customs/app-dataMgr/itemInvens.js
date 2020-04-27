const ExInvens = require('./exInvens');
const Structs   = require('app-structs');
const Const   = require('uw-const');
const CsvMgr   = require('uw-csvMgr');
const ItemInvenStruct   = require('uw-dao/game/itemInvens').Struct;

module.exports = class extends ExInvens {
    constructor() {
        super('itemId');
        this._isNotEnough = false;
    }

    __getMaxCnt() {
        if (!this.dataMgr.isInit())
            return 0;

        let user = this.dataMgr.user.get();
        return user.itemInvenCnt;
    }
    async __getCntFromDb() {
        if (!this.dataMgr.isInit())
            return 0;

        let user = this.dataMgr.user.get();
        return await this.dataMgr.daoGame.itemInvens.getCnt(user.srl);
    }
    async __getRowsFromDb(srls, ids) {
        if (!this.dataMgr.isInit())
            return [];

        let user = this.dataMgr.user.get();
        return await this.dataMgr.daoGame.itemInvens.getsBySrlOrItemId(user.srl, srls, ids);
    }
    async __removeDbRows(srls) {
        if (!this.dataMgr.isInit())
            return;

        let user = this.dataMgr.user.get();
        await this.dataMgr.daoGame.itemInvens.removes(user.srl, srls);
    }
    async __insertDbRows(rows) {
        if (!this.dataMgr.isInit())
            return;

        let user = this.dataMgr.user.get();
        await this.dataMgr.daoGame.itemInvens.inserts(user.srl, rows);
    }
    async __modifyDbRows(rows) {
        if (!this.dataMgr.isInit())
            return;

        let user = this.dataMgr.user.get();
        for (let i=0; i<rows.length; i++)
            await this.dataMgr.daoGame.itemInvens.update(user.srl, rows[i].srl, rows[i].onData);
    }

    /** @returns {ItemInvenStruct} */
    async get(srl) { return await super.get(srl); }
    
    /** @returns {Array.<ItemInvenStruct>} */
    async gets(filter) { return await super.gets(filter); }

    async add(itemId, cnt) {
        if (!this.dataMgr.isInit())
            return;

        if (!CsvMgr.items.exists(itemId))
            return;

        let itemCsv = CsvMgr.items.get(itemId);
        let user = this.dataMgr.user.get();

        while (cnt > 0) {
            if (await this.isMax())
                break;

            let overlapCnt = Math.min(cnt, itemCsv.overlapCount);
            let itemInven = new ItemInvenStruct(user.srl, itemCsv.id, overlapCnt);
            if (itemCsv.type === Const.ITEM_TYPES.LUNA) {
                let itemLunaCsv = CsvMgr.itemLunas.get(itemId);
                //itemInven.level = 1;
                itemInven.statusPoint = Math.$rand(itemLunaCsv.minStatusPoint, itemLunaCsv.maxStatusPoint);
            }

            await super.add(itemInven);
            cnt -= overlapCnt;
        }

        if (cnt > 0) {
            this.dataMgr.newPosts.add(this._getRewardTypeByItemType(itemCsv.type), itemCsv.id, cnt);
            this.dataMgr.newPosts.setIsOverStoragePost();
        }
    }

    async incr(itemId, cnt) {
        if (!this.dataMgr.isInit())
            return;

        if (!CsvMgr.items.exists(itemId))
            return;

        let itemCsv = CsvMgr.items.get(itemId);
        if ([Const.ITEM_TYPES.LUNA, Const.ITEM_TYPES.SOULGEM].$exists(itemCsv.type))
            return;

        await this.gets();

        let rows = this.rows.filter(m => m.itemId===itemId);
        let remainCnt = rows.$sum(m => m.overlapCnt);
        remainCnt += cnt;

        if (remainCnt < 0) {
            this._isNotEnought = true;
            return;
        }

        rows.forEach(m => {
            m.overlapCnt = Math.min(remainCnt, itemCsv.overlapCount);
            remainCnt -= m.overlapCnt;
        });

        let user = this.dataMgr.user.get();
        await this.getCnt();

        while (remainCnt > 0) {
            if (await this.isMax())
                break;

            let overlapCnt = Math.min(remainCnt, itemCsv.overlapCount);
            let itemInven = new ItemInvenStruct(user.srl, itemCsv.id, overlapCnt);
            this.rows.push(itemInven);
            remainCnt -= overlapCnt;
            this.cnt++;
        }
        
        if (remainCnt > 0) {
            this.dataMgr.newPosts.add(this._getRewardTypeByItemType(itemCsv.type), itemCsv.id, remainCnt);
            this.dataMgr.newPosts.setIsOverStoragePost();
        }
    }

    async saveDb() {
        this.rows.forEach((m, i) => {
            if (m.overlapCnt > 0)
                return;

            this.rows.splice(i--, 1);
            this.cnt--;
        });

        let result = await super.saveDb();
        return result;
    }

    isNotEnough() {
        return this._isNotEnough;
    }

    _getRewardTypeByItemType(itemType) {
        switch (itemType) {
            case Const.ITEM_TYPES.LUNA:         return Const.REWARD_TYPES.ITEM_LUNA;
            case Const.ITEM_TYPES.SOULGEM:      return Const.REWARD_TYPES.ITEM_SOULGEM;
            case Const.ITEM_TYPES.MATERIAL:     return Const.REWARD_TYPES.ITEM_MATERIAL;
            case Const.ITEM_TYPES.NORMAL_BOX:   return Const.REWARD_TYPES.ITEM_NORMAL_BOX;
            case Const.ITEM_TYPES.TRACKING_BOX: return Const.REWARD_TYPES.ITEM_TRACKING_BOX;
        }
        return Const.REWARD_TYPES.NONE;
    }
};