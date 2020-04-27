const mysql = require('mysql2/promise');
const shortid = require('shortid');

const Context = require('./context');
const Exec = require('../utils/extender-exec');

module.exports = class extends Exec {
    constructor(id, masterCfgs, replicaCfgs) {
        super();

        if (id === undefined || id === null)
            id = shortid.generate();

        this.id = id;
        this.masterPools = [];
        this.replicaPools = [];

        if (Array.isArray(masterCfgs))
            masterCfgs.forEach(cfg => { this.addMaster(cfg); });

        if (Array.isArray(replicaCfgs))
            replicaCfgs.forEach(cfg => { this.addReplica(cfg); });
    }

    getId() {
        return this.id;
    }

    addMaster(cfg) {
        this.masterPools.push(mysql.createPool(cfg));
    }

    addReplica(cfg) {
        this.replicaPools.push(mysql.createPool(cfg));
    }

    async query(sql, args) {
        if (this._isWriteSql(sql))
            return await this.getWritePool().query(sql, args);

        return await this.getReadPool().query(sql, args);
    }

    async getConnection() {
        return await this.getWriteConnection();
    }

    async end() {
        this.masterPools.forEach(async (pool) => {
            await pool.end();
        });
        this.replicaPools.forEach(async (pool) => {
            await pool.end();
        });
    }

    getWritePool() {
        return this.masterPools.$rand();
    }

    getReadPool() {
        if (this.replicaPools.length === 0)
            return this.getWritePool();

        return this.replicaPools.$rand();
    }

    async getWriteConnection() {
        return await this.getWritePool().getConnection();
    }

    async getReadConnection() {
        return await this.getReadPool().getConnection();
    }

    createContext(opt) {
        let masterPool = null;
        let replicaPool = null;

        if (this.masterPools.length > 0)
            masterPool = this.masterPools.$rand();
        if (this.replicaPools.length > 0)
            replicaPool = this.replicaPools.$rand();

        let context = new Context(this.id, masterPool, replicaPool, opt);

        if (this.mapper)
            context.setMapper(this.mapper);

        return context;
    }
};