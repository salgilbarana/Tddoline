const Const = require('uw-const');
const CsvMgr = require('uw-csvMgr');

class Struct {
    constructor(userSrl,itemId,cnt) {
        this.userSrl = userSrl;
        this.itemId = itemId;
        this.exp = 0;
        this.cnt = cnt;
    }
}

const Class = class {
    constructor(dbGameSrv) {
        this.Struct = Struct;
        this.dbGameSrv = dbGameSrv;
    }

    /** @returns {Struct} */
    async insert(userSrl, itemId, cnt) {
        let db = await this.dbGameSrv.getShard();
        let item = new Struct(userSrl, itemId, cnt);
        let result = await db.insert('items', item);
        if (result)
            item.srl = result[0].insertId;

        return item;
    }

    async inserts(...rows) {
        let db = await this.dbGameSrv.getShard();
        let result = await db.insert('items', rows);
        return rows;
    }

    async update(itemSrl,userSrl, data) {
        let db = await this.dbGameSrv.getShard();
        await db.update('items', data, {itemSrl : itemSrl, userSrl : userSrl});
    }

    async exists(itemSrl, userSrl) {
        let db = await this.dbGameSrv.getShard();
        return await db.exists('items', {itemSrl: itemSrl, userSrl: userSrl});
    }

    async countMatch(itemIds,userSrl){
        let count = itemIds.length;
        let db = await this.dbGameSrv.getShard();
        return await db.countmatch('items', {itemSrl: itemIds, userSrl: userSrl},count);
    }

    async getByItemId(itemId, userSrl) {
        let db = await this.dbGameSrv.getShard();
        return await db.row('items', {itemId: itemId, userSrl: userSrl});
    }

    async getByItemSrl(itemSrl, userSrl) {
        let db = await this.dbGameSrv.getShard();
        return await db.row('items', {itemSrl: itemSrl, userSrl: userSrl});
    }

    async getsByItemIds(itemIds,userSrl) { //아이템 고유 id로 gets
        let db = await this.dbGameSrv.getShard();
        let where = {userSrl: userSrl};
        if (typeof itemIds !== 'undefined')
            where.itemId = itemIds;

        return await db.rows('items', where);
    }

    async getsByItemSrl(itemSrl,userSrl) { //아이템 srl을 이용해서 서치
        let db = await this.dbGameSrv.getShard();

        return await db.rows('items', {userSrl: userSrl,itemSrl:itemSrl});
    }

    async getsAll(userSrl) {
        let db = await this.dbGameSrv.getShard();

        return await db.rows('items', {userSrl: userSrl});
    }

    async remove(itemSrl,userSrl) {
        let db = await this.dbGameSrv.getShard();
        return await db.delete('items', {itemSrl: itemSrl, userSrl : userSrl});
    }

    async getTotalCnt(userSrl){ //현재 캐릭터가 들고 있는 아이템 갯수
        let db = await this.dbGameSrv.getShard();

        return await db.one('SELECT SUM(cnt) FROM items',{userSrl:userSrl});

    }

    async getDefaultEquipments(userSrl){
        let result = [];
        result.push(new Struct(100001,userSrl,1)); //기본 장비 아이템 지급
        result.push(new Struct(100002,userSrl,1)); //기본 장비 아이템 지급

        return result;
    }


};

Class.Struct = Struct;
module.exports = Class;