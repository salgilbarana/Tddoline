/*db 서버 테이블 관련 index*/
const UserInfo = require('./userInfo');
const CharInfo = require('./charInfo');
const Items = require('./items');
const UserDevices = require('./userDevices');
// ych 0422
const Boards = require('./boards');
//

module.exports = class {
    constructor(dbGameSrv) {
        this.dbGameSrv = dbGameSrv;

        this.userInfo = new UserInfo(dbGameSrv);
        this.charInfo = new CharInfo(dbGameSrv);
        this.items = new Items(dbGameSrv);
        this.userDevices = new UserDevices(dbGameSrv);
        // ych 0422
        this.boards = new Boards(dbGameSrv);
        //
    }
};