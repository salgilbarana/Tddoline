const Const = require('uw-const');

const UserMgr = require('./user');
const UtilMgr = require('./util');
//const CharactersMgr = require('./characters');
const DaoGame   = require('uw-dao/game');

module.exports = class {
    /** @param {DaoGame} daoGame */
    constructor(daoGame, daoCache) {
        this.daoGame = daoGame;

        this.user = new UserMgr();
        this.util = new UtilMgr();

        this.user.setDataMgr(this);
        this.util.setDataMgr(this);
    }

    isInit() {
        let user = this.user.get();
        return Boolean(user);
    }

    init(user) {
        this.user.set(user);
    }

    async saveDb() {
        if (!this.isInit())
            return;

        let update = {};

        let userUpdate = await this.user.saveDb();
        //let charactersUpdate = await this.characters.saveDb();

        if (userUpdate)
            update.user = userUpdate;


        return !update.$isEmpty() ? update : null;
    }
};