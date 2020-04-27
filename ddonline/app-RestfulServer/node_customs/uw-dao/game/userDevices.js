class Struct {
    constructor(userSrl, deviceId, platformType) {
        this.userSrl = userSrl;
        this.deviceId = deviceId;
        this.platformType = platformType;
        this.regTs = Date.$nowSecs();
    }
}

module.exports = class {
    constructor(dbGameSrv) {
        this.Struct = Struct;
        this.dbGameSrv = dbGameSrv;
    }

    async exists(userSrl, deviceId) {
        let db = await this.dbGameSrv.getShard();
        return await db.exists('userDevices', {userSrl: userSrl, deviceId: deviceId});
    }

    async insert(userSrl, deviceId, platformType) {
        let db = await this.dbGameSrv.getShard();
        await db.insert('userDevices', new Struct(userSrl, deviceId, platformType));
    }
};