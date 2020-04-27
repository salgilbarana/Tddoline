const Payments = require('./payments');
const RestfulServerReqs = require('./restfulServerReqs');

module.exports = class {
    constructor(dbSrv) {
        this.dbSrv = dbSrv;

        this.payments = new Payments(dbSrv);
        this.restfulServerReqs = new RestfulServerReqs(dbSrv);
    }
};