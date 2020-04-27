module.exports = class {
    constructor(ctx) {
        this.ctx = ctx;
        this.data = {};
        this.isSuccess = false;
    }

    setGlobal(key, value) {
        if (!('global' in this.data))
            this.data.global = {};

        this.data.global[key] = value;
    }

    /*set(key, value) {
        if (!('ret' in this.data))
            this.data.ret = {};

        this.data.ret[key] = value;
    }*/

    set(key, value) {
        this.data[key] = value;
    }

    BadRequest() {
        this.ctx.throw(400);
    }

    Next(data) {
        /*if (data) {
            if (!('ret' in this.data)){
                console.log("이곳1");
                this.data = data;
            }
            else {
                console.log("이곳2");
                for (let key in data)
                    this.data[key] = data[key];
            }
        }*/
        if(data)
            this.data = data;
        return true;
    }

    Success() {
        this.isSuccess = true;
        this.ctx.body = this.data;
    }

    Fail(type, msg, data) {
        var err = {
            type : type
        };
        if (typeof msg !== 'undefined')
            err.msg = msg;
        if (typeof data !== 'undefined')
            err.data = data;

        this.isSuccess = false;
        this.ctx.body = {
            err : err
        };

        return false;
    }
};