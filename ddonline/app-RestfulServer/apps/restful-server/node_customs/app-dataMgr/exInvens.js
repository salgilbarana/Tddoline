const Const     = require('uw-const');
const CsvMgr    = require('uw-csvMgr');

const DataMgr = require('app-dataMgr');

module.exports = class {
    constructor(idColumn) {
        /** @type {DataMgr} */
        this.dataMgr = null;
        this.idColumn = idColumn;

        this.findSrls = [];
        this.findIds = [];
        this.isFindAll = false;
        this.removeSrls = [];

        this.findedSrls = [];
        this.findedIds = [];
        this.isFindedAllFromDb = false;
        this.isFindedCntFromDb = false;

        this.cnt = 0;
        this.rows = [];
        this.originRows = [];
    }

    __getMaxCnt() { return 0; }
    async __getCntFromDb() { return 0; }
    async __getRowsFromDb(srls, ids) { return []; }
    async __removeDbRows(srls) {}
    async __insertDbRows(rows) {}
    async __modifyDbRows(rows) {}

    setDataMgr(dataMgr) {
        this.dataMgr = dataMgr;
    }
    init(...rows) {
        rows.forEach(row => {
            var sameRow = this.rows.find(m => m.srl===row.srl);
            if (sameRow)
                for (var column in sameRow) sameRow[column] = row[column];
            else
                this.rows.push(row.$copy());

            var sameRow = this.originRows.find(m => m.srl===row.srl);
            if (sameRow)
                for (var column in sameRow) sameRow[column] = row[column];
            else
                this.originRows.push(row.$copy());

            if (!this.findedSrls.$exists(row.srl))
                this.findedSrls.push(row.srl);
        });
    }

    findSrl(...srls) {
        this.findSrls.push(...srls);
    }
    findId(...ids) {
        this.findIds.push(...ids);
    }
    findAll() {
        this.isFindAll = true;
    }
    findReducer() {
        if (this.isFindedAllFromDb) {
            this.isFindAll = false;
            this.findSrls.length = 0;
            this.findIds.length = 0;
        }

        if (this.isFindAll) {
            this.findSrls.length = 0;
            this.findIds.length = 0;
        }

        if (this.findSrls.length > 0)
            this.findSrls = this.findSrls.$unique().$diff(this.findedSrls);

        if (this.findIds.length > 0)
            this.findIds = this.findIds.$unique().$diff(this.findedIds);
    }
    isFindable() {
        this.findReducer();
        return (this.isFindAll || this.findSrls.length + this.findIds.length > 0);
    }

    async isMax() {
        return (this.__getMaxCnt() <= await this.getCnt());
    }

    async getCnt() {
        if (this.dataMgr.isInit() && !this.isFindedCntFromDb) {
            if (this.isFindAll) {
                await this.gets();
            } else {
                this.cnt = await this.__getCntFromDb();
                this.isFindedCntFromDb = true;
            }
        }

        return this.cnt;
    }

    async get(srl) {
        await this.gets();
        return this.rows.find(m => m.srl === srl);
    }

    async gets(filter) {
        this.findReducer();

        if (this.dataMgr.isInit() && this.isFindable()) {
            let user = this.dataMgr.user.get();
            let rows = await this.__getRowsFromDb(this.findSrls, this.findIds);
            rows.forEach(m => {
                if (this.isFindAll && !this.findedIds.$exists(m[this.idColumn]))
                    this.findedIds.push(m[this.idColumn]);

                if (this.findedSrls.$exists(m.srl))
                    return;

                this.findedSrls.push(m.srl);
                this.rows.push(m);
                this.originRows.push(m.$copy());
            });

            this.findSrls.forEach(srl => {
                if (this.findedSrls.$exists(srl))
                    return;
    
                this.findedSrls.push(srl);
            });

            this.findIds.forEach(id => {
                if (this.findedIds.$exists(id))
                    return;
    
                this.findedIds.push(id);
            });

            if (this.removeSrls.length > 0) {
                let removeSrls = this.removeSrls.$unique();
                this.removeSrls.length = 0;
                this.remove(...removeSrls);
            }

            if (this.isFindAll) {
                this.cnt = this.rows.length;
                this.isFindedAllFromDb = true;
                this.isFindedCntFromDb = true;
            }

            this.findSrls.length = 0;
            this.findIds.length = 0;
            this.isFindAll = false;
        }

        if (typeof filter === 'function')
            return this.rows.filter(filter);

        return this.rows;
    }

    async add(row) {
        this.rows.push(row);
        this.cnt++;
    }

    remove(...srls) {
        if (!this.dataMgr.isInit())
            return;

        let removedSrls = [];

        for (let i=0; i<this.rows.length; i++) {
            if (removedSrls.length === srls.length)
                break;

            if (!srls.$exists(this.rows[i].srl))
                continue;

            removedSrls.push(this.rows[i].srl);
            this.rows.splice(i--, 1);
            this.cnt--;
        }

        if (removedSrls.length === srls.length)
            return;

        let remainSrls = srls.$diff(removedSrls).$diff(this.removeSrls);
        this.removeSrls.push(...remainSrls);
    }


    async saveDb() {
        if (!this.dataMgr.isInit())
            return null;

        let user = this.dataMgr.user.get();
        let result = {};

        let removeSrls = this.removeSrls.$unique();
        this.removeSrls.length = 0;
        let removedRows = this.rows.$getRemovedRowsFrom(this.originRows, 'srl');

        if (removedRows.length > 0)
            removeSrls.push(...removedRows.map(m => m.srl));

        if (removeSrls.length > 0) {
            await this.__removeDbRows(removeSrls);
            result.removeSrls = removeSrls;
        }

        let insertedRows = this.rows.$getInsertedRowsFrom(this.originRows, 'srl');
        if (insertedRows.length > 0) {
            await this.__insertDbRows(insertedRows);
            result.inserts = insertedRows;
        }

        let modifiedRows = this.rows.$getModifiedRowsFrom(this.originRows, 'srl');
        if (modifiedRows.length > 0) {
            await this.__modifyDbRows(modifiedRows);
            result.modifies = modifiedRows;
        }

        this.originRows = this.rows.$copy();

        return !result.$isEmpty() ? result : null;
    }
};