module.exports = {
    where(where) {
        var wheres = [];
        var args = [];

        if (typeof where === 'object' && !Array.isArray(where)) {
            for (var key in where) {
                if (Array.isArray(where[key])) {
                    var _args = where[key];
                    var _sql = '';

                    if (_args.indexOf(null) > -1) {
                        _sql += key + ' IS NULL';
                        _args = where[key].filter((m) => (m !== null));
                    }

                    if (_args.length > 0) {
                        var bindStr = [].$fix(_args.length, '?').join(',');
                        args.push(...Object.values(_args));
                        _sql += key + ' IN (' + bindStr + ')';
                    }

                    wheres.push(_sql);
                } else {
                    if (where[key] === null) {
                        wheres.push(key + ' IS NULL');
                    } else {
                        wheres.push(key + '=?');
                        args.push(where[key]);
                    }
                }
            }
        } else {
            args = where;
        }

        return {
            sql : wheres.join(' AND '),
            args : args
        };
    },

    set(data, isIncr) {
        var sets = [];
        var args = [];

        if (typeof data === 'object' && !Array.isArray(data)) {
            for (var key in data) {
                if (isIncr)
                    sets.push(key + '=' + key + '+?');
                else
                    sets.push(key + '=?');

                this._setArgs(args, data[key]);
            }
        }

        return {
            sql : sets.join(', '),
            args : args
        };
    },

    _setArgs(args, value) {
        if (value !== null && typeof value === 'object')
            args.push(JSON.stringify(value));
        else
            args.push(value);
    },

    insert (sql, data, isIgnore) {
        isIgnore = Boolean(isIgnore);
        var args = [];

        if (!this.isSql(sql) && typeof data === 'object') {
            sql = 'INSERT ' + (isIgnore ? 'IGNORE ' : '') + 'INTO ' + sql;
            var keys = [];
            var bindStrs = [];

            if (Array.isArray(data) && data.length > 0) {
                keys = Object.keys(data[0]);
                var bindStr = [].$fix(keys.length, '?').join(',');

                for (var i=0; i<data.length; i++) {
                    bindStrs.push('(' + bindStr + ')');
                    for (let column in data[i]) this._setArgs(args, data[i][column]);
                }
            } else {
                keys = Object.keys(data);
                var bindStr = [].$fix(keys.length, '?').join(',');
                bindStrs.push('(' + bindStr + ')');

                for (let column in data) {
                    this._setArgs(args, data[column]);
                }
                //args = Object.values(data);
            }

            sql += '(' + keys + ') VALUES ' + bindStrs.join(',');
        }

        return {
            sql : sql,
            args : args
        };
    },

    incr (sql, set, where) {
        var args = [];
        if (!this.isSql(sql) && typeof set === 'object') {
            var exec = this.set(set, true);
            sql = 'UPDATE ' + sql + ' SET ' + exec.sql;
            args = exec.args;
        }

        var exec = this.where(where);
        if (exec.sql) {
            sql += ' WHERE ' + exec.sql;
            args.push(...exec.args);
        }

        return {
            sql : sql,
            args : args
        };

    },

    update (sql, set, where) {
        var args = [];
        if (!this.isSql(sql) && typeof set === 'object') {
            var exec = this.set(set);
            sql = 'UPDATE ' + sql + ' SET ' + exec.sql;
            args = exec.args;
        }

        var exec = this.where(where);
        if (exec.sql) {
            sql += ' WHERE ' + exec.sql;
            args.push(...exec.args);
        }

        return {
            sql : sql,
            args : args
        };
    },

    upsertForNotUpdate(sql, data, fakeColumn) {
        let keys = Object.keys(data);
        let insert = this.insert(sql, data);

        insert.sql += ' ON DUPLICATE KEY UPDATE ' + fakeColumn + '=' + fakeColumn;

        return {
            sql : insert.sql,
            args : insert.args
        }
    },

    upsert (sql, data, pks, updateColumns) {
        let insert = this.insert(sql, data);

        let update = null;
        if (updateColumns) {
            update = {};
            updateColumns.forEach(column => update[column] = data[column]);
        } else {
            update = data.$copy();
            pks.forEach(pk => delete update[pk]);
        }

        let set = this.set(update);
        insert.sql += ' ON DUPLICATE KEY UPDATE ' + set.sql;
        insert.args.push(...set.args);

        return {
            sql : insert.sql,
            args : insert.args
        }
    },

    select (sql, where, column) {
        if (!this.isSql(sql)) {
            if (sql.indexOf('.') > -1) {
                let splits = sql.split('.');
                column = splits[1];
                sql = splits[0];
            } else if (!column) {
                column = '*';
            }

            sql = 'SELECT ' + column + ' FROM ' + sql;
        }

        var exec = this.where(where);
        if (exec.sql)
            sql += ' WHERE ' + exec.sql;

        return {
            sql : sql,
            args : exec.args
        };
    },

    delete (sql, where) {
        if (!this.isSql(sql))
            sql = 'DELETE FROM ' + sql;

        var exec = this.where(where);
        if (exec.sql)
            sql += ' WHERE ' + exec.sql;

        return {
            sql : sql,
            args : exec.args
        };
    },

    isSql(sql) {
        return sql.indexOf(' ') > -1;
    }
};