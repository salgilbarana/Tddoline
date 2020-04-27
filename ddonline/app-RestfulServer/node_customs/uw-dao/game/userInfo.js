const Const = require('uw-const');
const CsvMgr = require('uw-csvMgr');
const moment = require('moment');

class Struct {
    constructor(ch_type, ch_id, name) {
        this.srl = null;
        this.ch_type = ch_type;
        this.ch_id = ch_id;
        this.name = name;
        this.charSrl = 0;
        this.goldPoop = 0;
        this.silverPoop = 0;
        this.bronzePoop = 0;
        this.accGP = 0;
        this.accSP = 0;
        this.accBP = 0;
        this.winCnt = 0;
        this.loseCnt = 0;
        //this.regDate = new Date();
        this.regDate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    }
}

const Class = class {
    constructor(dbGameSrv) {
        this.Struct = Struct;
        this.dbGameSrv = dbGameSrv;
    }

    async existsByChannel(ch_type, ch_id) {
        let db = await this.dbGameSrv.getShard();
        return await db.exists('userInfo', {ch_type: ch_type, ch_id: ch_id});
    }
    async existsByName(name) {
        let db = await this.dbGameSrv.getShard();
        return await db.exists('userInfo', {name: name});
    }

    /** @returns {Struct} */
    async getByChannel(ch_type, ch_id) {
        let db = await this.dbGameSrv.getShard();
        return await db.row('userInfo', {ch_type: ch_type, ch_id: ch_id});
    }
	
	async getByIdPw(id, pw) {
        let db = await this.dbGameSrv.getShard();
        return await db.row('userInfo', {id: id, pw: pw});
    }
	async getById(id) {
        let db = await this.dbGameSrv.getShard();
        return await db.row('userInfo', {id: id});
    }

    /** @returns {Struct} */
    async get(srl) {
        let db = await this.dbGameSrv.getShard();
        return await db.row('userInfo', {srl: srl});
    }

    /** @returns {Struct} */
    async insert(ch_type, ch_id, name) {
        let db = await this.dbGameSrv.getShard();
        let item = new Struct(ch_type, ch_id, name);
        let result = await db.insert('userInfo', item);
        if (result)
            item.srl = result[0].insertId;

        return item;
    }

    async update(srl, data) {
        let db = await this.dbGameSrv.getShard();
        await db.update('userInfo', data, {srl : srl});
    }


};

Class.Struct = Struct;
module.exports = Class;