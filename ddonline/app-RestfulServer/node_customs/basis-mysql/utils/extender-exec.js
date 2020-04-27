const sqlgen = require('./sqlgen');

module.exports = class {
    constructor() {
        this.mapper = null;
    }

    setMapper(method) {
        this.mapper = method;
    }

    async exists(sql, where) {
        var cnt = await this.count(sql, where);
        return (cnt > 0);
    }
    //보내온 itemSrl 의 갯수와 카운트 수가 맞는지 체크하는 함수를 만들 예정
    async countmatch(sql, where, count){
        var sqlResultCnt = await this.count(sql,where);
        if(sqlResultCnt !== count)
            return false;

        return true;
    }

    async count(sql, where) {
        var exec = sqlgen.select(sql, where, 'COUNT(*) AS cnt');
        var result = await this.query(exec.sql + ' LIMIT 1', exec.args);
        if (result[0].length === 0)
            return 0;

        return result[0][0]['cnt'];
    }

    async row(sql, where) {
        var exec = sqlgen.select(sql, where);
        var result = await this.query(exec.sql + ' LIMIT 1', exec.args);
        if (result[0].length === 0)
            return null;

        if (this.mapper)
            result[0].forEach(m => { this.mapper(m); });

        return result[0][0];
    }

    async rows(sql, where) {
        var exec = sqlgen.select(sql, where);
        var result = await this.query(exec.sql, exec.args);

        if (this.mapper)
            result[0].forEach(m => { this.mapper(m); });

        return result[0];
    }

    async one(sql, where) {
        var exec = sqlgen.select(sql, where);
        var result = await this.query(exec.sql + ' LIMIT 1', exec.args);
        if (result[0].length === 0)
            return null;

        if (this.mapper)
            result[0].forEach(m => { this.mapper(m); });

        var column = result[1][0].name;
        return result[0][0][column];
    }

    async ones(sql, where) {
        var exec = sqlgen.select(sql, where);
        var result = await this.query(exec.sql, exec.args);
        var column = result[1][0].name;

        var rows = [];
        result[0].forEach(m => {
            if (this.mapper)
                this.mapper(m);

            rows.push(m[column]);
        });

        return rows;
    }

    async insert(sql, args, isIgnore) {
        var exec = sqlgen.insert(sql, args, isIgnore);
        var result = await this.query(exec.sql, exec.args);
        return result;
    }

    async upsertForNotUpdate(sql, args, fakeColumn) {
        var exec = sqlgen.upsertForNotUpdate(sql, args, fakeColumn);
        var result = await this.query(exec.sql, exec.args);
        return result;
    }

    async upsert(sql, args, pks, updateColumns) {
        var exec = sqlgen.upsert(sql, args, pks, updateColumns);
        var result = await this.query(exec.sql, exec.args);
        return result;
    }

    async update(sql, set, where) {
        var exec = sqlgen.update(sql, set, where);
        var result = await this.query(exec.sql, exec.args);
        return result;
    }

    async delete(sql, where) {
        var exec = sqlgen.delete(sql, where);
        var result = await this.query(exec.sql, exec.args);
        return result;
    }

    async incr(sql, set, where) {
        var exec = sqlgen.incr(sql, set, where);
        var result = await this.query(exec.sql, exec.args);
        return result;
    }

    _isWriteSql(sql) {
        var sql = sql.trimLeft();

        if (sql.substr(0, 6) === 'SELECT')
            return false;

        if (sql.substr(0, 4) === 'SHOW')
            return false;

        return true;
    }
};