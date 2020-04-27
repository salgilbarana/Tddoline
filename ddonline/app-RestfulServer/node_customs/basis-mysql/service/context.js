module.exports = class {
    constructor(shardPerId) {
        this.shardPerId = shardPerId;
        this.bootId = null;
        this.length = Object.values(shardPerId).length;

        for (var id in this.shardPerId) {
            this.bootId = id;
            break;
        }

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

    getShard(id) {
        if (this.length === 1 && (id === undefined || id === null))
            id = this.bootId;

        if (id === null)
            return null;

        if (!(id in this.shardPerId))
            return null;

        return this.shardPerId[id];
    }

    ifBegin() {
        for (var id in this.shardPerId)
            this.shardPerId[id].ifBegin();
    }
    ifCommit() {
        for (var id in this.shardPerId)
            this.shardPerId[id].ifCommit();
    }
    ifRollback() {
        for (var id in this.shardPerId)
            this.shardPerId[id].ifRollback();
    }
    ifRelease() {
        for (var id in this.shardPerId)
            this.shardPerId[id].ifRelease();
    }

    getLogs() {
        let logs = [];
        for (var id in this.shardPerId) {
            let _logs = this.shardPerId[id].getLogs();
            if (_logs.length === 0)
                continue;

            logs.push({
                shardId : id,
                logs : _logs
            })
        }

        return logs;
    }
};