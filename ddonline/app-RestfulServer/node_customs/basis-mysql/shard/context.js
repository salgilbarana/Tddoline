const Exec = require('../utils/extender-exec');

module.exports = class extends Exec {
    constructor(id, masterPool, replicaPool, opt) {
        super();

        this.id = id;
        this.masterPool = masterPool;
        this.replicaPool = replicaPool;

        this.writeConn = null;
        this.readConn = null;

        this.logs = [];
        this.isBegin = false;

        this.opt = {
            isLog : true,
            isAutoBegin : true
        };

        if (Object.$isPure(opt)) {
            for (var key in opt)
                this.opt[key] = opt[key];
        }
    }

    getId() {
        return this.id;
    }

    async query(sql, args) {
        const isWriteSql = this._isWriteSql(sql);
        if (this.opt.isAutoBegin && isWriteSql)
            await this.ifBegin();

        const conn = isWriteSql ? await this.getWriteConnection() : await this.getReadConnection();

        this._addLog(conn, '['+ (isWriteSql ? 'MASTER' : 'REPLICA') + '] ' + sql, args);
        return await conn.query({sql: sql, timeout:8000}, args);
    }

    async ifBegin() {
        if (this.isBegin)
            return;

        this.isBegin = true;

        const conn = await this.getWriteConnection();
        this._addLog(conn, 'BEGIN');
        await conn.beginTransaction();
    }

    async ifCommit() {
        if (!this.isBegin)
            return;

        if (!this.writeConn)
            return;

        const conn = await this.getWriteConnection();
        this._addLog(conn, 'COMMIT');
        await conn.commit();
    }

    async ifRollback() {
        if (!this.isBegin)
            return;

        if (!this.writeConn)
            return;

        const conn = await this.getWriteConnection();
        this._addLog(conn, 'ROLLBACK');
        await conn.rollback();
    }

    async ifRelease() {
        if (this.writeConn && this.writeConn === this.readConn) {
            await this.writeConn.release();
            return;
        }

        if (this.writeConn)
            await this.writeConn.release();

        if (this.readConn)
            await this.readConn.release();
    }

    async getWriteConnection() {
        if (!this.writeConn) {
            this.writeConn = await this.masterPool.getConnection();

            if (!this.readConn && this.masterPool === this.replicaPool)
                this.readConn = this.writeConn;
        }

        return this.writeConn;
    }

    async getReadConnection() {
        if (!this.readConn) {
            if (this.replicaPool) {
                this.readConn = await this.replicaPool.getConnection();

                if (!this.writeConn && this.masterPool === this.replicaPool)
                    this.writeConn = this.readConn;
            } else {
                this.readConn = await this.getWriteConnection();
            }
        }

        return this.readConn;
    }

    getLogs() {
        return this.logs;
    }

    _addLog(conn, sql, args) {
        //console.log(conn.connection.config.host, conn.connection.config.port, conn.connection.config.database, sql);
        if (!this.opt.isLog)
            return;

        var log = {connId : conn.connection.threadId, sql : sql};
        if (Array.isArray(args) && args.length > 0)
            log.args = args;

        this.logs.push(log);
    }
};