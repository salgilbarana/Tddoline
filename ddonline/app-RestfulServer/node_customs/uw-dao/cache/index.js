const Sessions = require('./sessions');

module.exports = class {
    constructor(db, opt) {
        this.db = db;
        this.logs = [];

        this.opt = {
            isLog : true
        };

        if (opt) {
            for (var key in opt)
                this.opt[key] = opt[key];
        }

        this.sessions = new Sessions(this);

    }

    async keys(pattern) {
        this._addLog('keys', [pattern]);
        return await this.db.keys(pattern);
        /*this.conn.keys(pattern, function(err, a) {
            console.log(err);
            console.log(a);
        });
        return [];*/
    }

    getLogs() {
        return this.logs;
    }

    _addLog(cmd, args) {
        if (!this.opt.isLog)
            return;

        var log = {cmd : cmd};
        if (Array.isArray(args) && args.length > 0)
            log.args = args;

        this.logs.push(log);
    }
};