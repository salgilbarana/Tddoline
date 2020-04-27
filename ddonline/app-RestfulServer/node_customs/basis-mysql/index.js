const Shard = require('./shard');
const Service = require('./service');

module.exports = {
    createService(...cfgs) {
        return new Service(...cfgs);
    },

    createShard(masterCfgs, replicaCfgs) {
        return new Shard(masterCfgs, replicaCfgs);
    }
};