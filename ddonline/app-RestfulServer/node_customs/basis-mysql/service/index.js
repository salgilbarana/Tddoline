const shortid = require('shortid');
const Context = require('./context');
const Shard = require('../shard');

module.exports = class {
    constructor(...cfgs) {
        this.shardPerId = {};
        this.bootId = null;
        this.length = 0;

        cfgs.forEach(cfg => {
            this.add(...cfg);
        });

        this.mapper = null;
    }

    setMapper(method) {
        this.mapper = method;

        if (this.mapper) {
            for (let id in this.shardPerId) {
                this.shardPerId[id].setMapper(this.mapper);
            }
        }
    }

    addShard(...args) {
        var id = null;
        var masterCfgs = null;
        var replicaCfgs = null;

        args.forEach(arg => {
            let type = typeof arg;
            if (type === 'string' || type === 'number') {
                if (id !== null)
                    return;

                id = arg;
            }

            if (type === 'object') {
                if (!masterCfgs)
                    masterCfgs = arg;

                if (!replicaCfgs)
                    masterCfgs = arg;
            }
        });

        if (id === undefined || id === null)
            id = shortid.generate();

        if (Object.$isPure(masterCfgs))
            masterCfgs = [masterCfgs];

        if (Object.$isPure(replicaCfgs))
            replicaCfgs = [replicaCfgs];

        const shard = new Shard(id, masterCfgs, replicaCfgs);

        if (this.mapper)
            shard.setMapper(this.mapper);

        this.shardPerId[id] = shard;

        if (this.bootId === null)
            this.bootId = id;

        this.length++;
    }

    /** @returns {Shard} */
    getShard(id) {
        if (this.length === 1 && (id === undefined || id === null))
            id = this.bootId;

        if (id === null)
            return null;

        if (!(id in this.shardPerId))
            return null;

        return this.shardPerId[id];
    }

    /** @returns {Context} */
    createContext(opt) {
        let shardCtxPerId = {};
        for (var id in this.shardPerId)
            shardCtxPerId[id] = this.shardPerId[id].createContext(opt);

        let context = new Context(shardCtxPerId);
        if (this.mapper)
            context.setMapper(this.mapper);

        return context;
    }
};