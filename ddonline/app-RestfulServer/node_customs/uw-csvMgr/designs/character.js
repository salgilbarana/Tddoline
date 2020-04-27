const Const = require('uw-const');

/** @type {Object.<String, Csv>} */
let csvPerId = null;

/** @type {Array.<Csv>} */
let csvs = [];

class Csv {
    constructor(m) {
        /*
        this.level = Number(m.level);
        this.hp = Number(m.hp);
        this.def = Number(m.def);
        this.str = Number(m.str);
        this.luck = Number(m.luck);
        this.dex = Number(m.dex);
        this.heal = Number(m.heal);
        this.needExp = Number(m.needExp);
        */
        this.id = Number(m.id);
        this.skinName = String(m.skinName);
        this.skillId = Number(m.id);
        this.speed = Number(m.id);
        this.slope = Number(m.id);
        this.rebound = Number(m.id);
        this.life = Number(m.id);

        this.$assertCheckColumn(m);
    }
}

module.exports = {
    init (rows) {
        csvs.push(...rows.map(m => new Csv(m)));
        csvPerId = csvs.$toObject(['id']);
    },

    exists(id) {
        return (id in csvPerId);
    },

    /** @returns {Csv} */
    get(id) {
        if (!this.exists(id))
            return null;
        return csvPerId[id];
    },

    getDefaultIds() {
        return csvs.filter(m => m.isDefault).map(m => m.id);
    }
};