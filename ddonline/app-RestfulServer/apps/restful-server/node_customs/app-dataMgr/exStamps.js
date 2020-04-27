const DataMgr = require('app-dataMgr');

module.exports = class {
    constructor(idColumn) {
        /** @type {DataMgr} */
        this.dataMgr = null;
        this.idColumn = idColumn;

        this.findIds = [];
        this.isFindAll = false;
        this.addIds = [];

        this.findedIds = [];
        this.isFindedAllFromDb = false;

        this.rows = [];
        this.originRows = [];
    }

    __newDefaultStruct() { return null; }
    async __getRowsFromDb(ids) { return []; }
    //async __removeDbRows(ids) {}
    async __insertDbRows(rows) {}
    async __modifyDbRows(rows) {}

    setDataMgr(dataMgr) {
        this.dataMgr = dataMgr;
    }
    init(...rows) {
        rows.forEach(row => {
            var sameRow = this.rows.find(m => m[this.idColumn] === row[this.idColumn]);
            if (sameRow)
                for (let column in sameRow) sameRow[column] = row[column];
            else
                this.rows.push(row.$copy());

            var sameRow = this.originRows.find(m => m[this.idColumn] === row[this.idColumn]);
            if (sameRow)
                for (let column in sameRow) sameRow[column] = row[column];
            else
                this.originRows.push(row.$copy());

            if (!this.findedIds.$exists(row[this.idColumn]))
                this.findedIds.push(row[this.idColumn]);
        });
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
            this.findIds.length = 0;
        }

        if (this.isFindAll) {
            this.findIds.length = 0;
        }

        if (this.findIds.length > 0)
            this.findIds = this.findIds.$unique().$diff(this.findedIds);
    }
    isFindable() {
        this.findReducer();
        return (this.isFindAll || this.findIds.length > 0);
    }

    add(id) {
        this.findId(id);
        this.addIds.push(id);
    }

    async gets(filter) {
        this.findReducer();

        if (this.dataMgr.isInit() && this.isFindable()) {
            let user = this.dataMgr.user.get();
            let rows = await this.__getRowsFromDb(this.findIds);
            rows.forEach(m => {
                if (this.findedIds.$exists(m[this.idColumn]))
                    return;

                this.findedIds.push(m[this.idColumn]);
                this.rows.push(m.$copy());
                this.originRows.push(m.$copy());
            });
            
            this.findIds.forEach(id => {
                if (this.findedIds.$exists(id))
                    return;

                this.findedIds.push(id);
            });
            
            if (this.isFindAll) {
                this.isFindedAllFromDb = true;
            }

            this.findIds.length = 0;
            this.isFindAll = false;
        }

        this.addIds.forEach(id => {
            if (this.rows.findIndex(m => m[this.idColumn]===id) > -1)
                return;

            let struct = this.__newDefaultStruct(id);
            if (struct === null)
                return;

            this.rows.push(struct);
        });
        this.addIds.length = 0;

        if (typeof filter === 'function')
            return this.rows.filter(filter);

        return this.rows;
    }

    async saveDb() {
        if (!this.dataMgr.isInit())
            return null;

        let user = this.dataMgr.user.get();
        let result = {};

        await this.gets();

        let insertedRows = this.rows.$getInsertedRowsFrom(this.originRows, ['userSrl', this.idColumn]);
        if (insertedRows.length > 0) {
            await this.__insertDbRows(insertedRows);
            result.inserts = insertedRows;
        }

        let modifiedRows = this.rows.$getModifiedRowsFrom(this.originRows, ['userSrl', this.idColumn]);
        if (modifiedRows.length > 0) {
            await this.__modifyDbRows(modifiedRows);
            result.modifies = modifiedRows;
        }

        this.originRows = this.rows.$copy();

        return !result.$isEmpty() ? result : null;
    }
};