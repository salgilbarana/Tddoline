const Const = require('uw-const');

/** @type {Object.<String, Csv>} */
let csvPerId = null;

/** @type {Array.<Csv>} */
let csvs = [];

class Csv {
    constructor(m) {
        this.id = Number(m.id);
        this.type = Number(m.type);
        this.elementalType = Number(m.elementalType);
        this.grade = Number(m.grade);
        this.name = String(m.name);
        this.atk = Number(m.atk);
        this.hp = Number(m.hp);
        this.heal = Number(m.heal);
        this.weightValueId = Number(m.weightValueId);
        this.evolveMaterial = [... JSON.parse(m.evolveMaterial)];
        this.evolveItem = Number(m.evolveItem);
        this.maxLv = Number(m.maxLv);

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
    }
};