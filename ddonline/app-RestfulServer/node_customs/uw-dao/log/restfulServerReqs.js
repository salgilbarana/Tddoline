const Const = require('uw-const');
const cron = require('node-cron');

let date = new Date();
let yyyy = date.getFullYear();
let mm = leadingZeros(date.getMonth()+1,2);
let dd = leadingZeros(date.getDate(),2);
let today = "log_"+yyyy+mm+dd;

cron.schedule('0-10 0 * * *',function () { //12시 0분부터 10분까지 실행
    let date = new Date();
    let yyyy = date.getFullYear();
    let mm = leadingZeros(date.getMonth()+1,2);
    let dd = leadingZeros(date.getDate(),2);
    today = "log_"+yyyy+mm+dd;
});
class Struct {
    constructor() {
        this.srl = null;
        this.route = null;
        this.req = null;
        this.status = 0;
        this.res = null;
        this.failType = 0;
        this.ip = null;
        this.deviceId = null;
        this.platformType = null;
        this.clientVer = 0;
        this.assetBundleVer = 0;
        this.sessId = null;
        this.userSrl = null;
        this.execMs = 0;
        this.regTs = Date.$nowSecs();
    }
}

const Class = class {
    constructor(dbSrv) {
        this.Struct = Struct;
        this.dbSrv = dbSrv;
        this.row = new Struct();
    }

    setDeviceId(deviceId) {
        this.row.deviceId = deviceId;
    }
    setPlatformType(platformType) {
        this.row.platformType = platformType;
    }
    setClientVer(ver) {
        this.row.clientVer = ver;
    }
    setCsvVer(ver) {
        this.row.csvVer = ver;
    }
    setSessId(sessId) {
        this.row.sessId = sessId;
    }
    setUserSrl(userSrl) {
        this.row.userSrl = userSrl;
    }

    async insert(route, req, status, res, failType, ip, execMs) {
        this.row.route = route;
        this.row.req = req;
        this.row.status = status;
        this.row.res = res;
        this.row.failType = failType;
        this.row.ip = ip;
        this.row.execMs = execMs;
        let db = await this.dbSrv.getShard();
        await db.insert('restfulServerReqs', this.row);
        //await db.insert(today, this.row);
    }
};

function leadingZeros(n,digits){
    let zero ='';
    n = n.toString();

    if(n.length < digits){
        for(let i = 0; i<digits - n.length; i++)
            zero += '0';
    }
    return zero +n;
}

Class.Struct = Struct;
module.exports = Class;
