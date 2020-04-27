const Const = require('uw-const');

class Csv {
    constructor() {
        //this.SHOOTING_TIME = 0;
        //this.STONE_MIN = 0;
        //this.RISE_ANGLE = 0;
        this.BOARD_WRITE_COST_SP = 100;

    }
    init(rows) {
        let data = rows.$toObjectVertical('key', 'value');

        this.$assertCheckColumn(data);

        Object.keys(this).forEach(key => {
            if (!isNaN(data[key]))
                this[key] = Number(data[key]);
            else {
                try {
                    this[key] = JSON.parse(data[key]);
                } catch (e) {
                    this[key] = data[key];
                }
            }
        });

        data = null;
    }
}

module.exports = new Csv;