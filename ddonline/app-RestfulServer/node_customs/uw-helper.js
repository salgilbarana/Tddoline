const Const     = require('uw-const');

module.exports = {
    getValueByRateFormat(valueAndRate) {
        let rates = valueAndRate.map(m => m[1]);
        let idx = Math.$ratingIndexOf(rates);
        if (idx === -1)
            return null;
        return valueAndRate[idx][0];
    },

    getRewardIdsByRate(cntRate, idRate) {
        let ids = [];
        let cnt = this.getValueByRateFormat(cntRate);
        for (let i=0; i<cnt; i++) {
            let id = this.getValueByRateFormat(idRate);
            ids.push(id);
        }
        return ids;
    },

    // BP = BP + 100 * (Number(p.isWin) - 승률);
    // 승률 : 1 / (1 + 10^((BPb - BPa)/500))      -> 여기서 BPb 값은 상대방의 BP값, BPa 는 나의 BP값
    getResultBp(myBp, targetBp, isWin) {
        let y = (targetBp - myBp) / 500;
        let rate = 1 / (1 + Math.pow(10, y));
        let bp = Math.floor(myBp + 100 * (Number(isWin) - rate));
        return Math.max(bp, 0);
    }

};