const Const = require('uw-const');
const CsvMgr = require('uw-csvMgr');

class Struct {
    constructor(userSrl) {
        this.srl = null;
        this.userSrl = userSrl;
        this.charId = 100;
        this.accExp = 0;
        this.level = 1;
    }
}

const Class = class {
    constructor(dbGameSrv) {
        this.Struct = Struct;
        this.dbGameSrv = dbGameSrv;
    }

    /** @returns {Array.<Struct>} */
    async gets(userSrl, srls, columns) {
        let db = await this.dbGameSrv.getShard();
        let where = {};
        if (typeof srls !== 'undefined')
            where.srl = srls;

        where.userSrl = userSrl;

        let table = 'charInfo';
        if (columns)
            table =+ '.' + columns.join(',');
        return await db.rows(table, where);
    }

    /** @returns {Struct} */
    async get(srl, userSrl) {
        let db = await this.dbGameSrv.getShard();
        let where = {srl: srl, userSrl: userSrl};
        return await db.row('charInfo', where);
    }

    async exists(srl,userSrl) {
        let db = await this.dbGameSrv.getShard();
        let where = {srl: srl, userSrl: userSrl};
        return await db.exists('charInfo', where);
    }

    async inserts(...rows) {
        let db = await this.dbGameSrv.getShard();
        let result = await db.insert('charInfo', rows);
        if (result) {
            let insertId = result[0].insertId;
            rows.forEach(m => {
                m.srl = insertId++;
            });
        }

        return rows;
    }

    async update(userSrl, srl, data) {
        let db = await this.dbGameSrv.getShard();
        return await db.update('charInfo', data, {srl : srl, userSrl: userSrl});
    }

    async updatesByOwnerSrl(srl, data) {
        let db = await this.dbGameSrv.getShard();
        return await db.update('charInfo', data, {ownerSrl : srl});
    }

    async removes(userSrl, srls) {
        let db = await this.dbGameSrv.getShard();
        return await db.delete('charInfo', {srl:srls, userSrl:userSrl});
    }

    async removeRefs(userSrl, srl) {
        let db = await this.dbGameSrv.getShard();
        return await db.delete('DELETE FROM charInfo WHERE srl=? OR ownerSrl=?', [srl, srl]);
    }
};

Class.Struct = Struct;
module.exports = Class;