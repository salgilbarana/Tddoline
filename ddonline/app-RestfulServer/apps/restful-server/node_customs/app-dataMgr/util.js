const Const = require('uw-const');
const Structs = require('app-structs');
const CsvMgr = require('uw-csvMgr');


module.exports = class {
    constructor() {
        /** @type {DataMgr} */
        this.dataMgr = null;
    }

    setDataMgr(dataMgr) {
        this.dataMgr = dataMgr;
    }


    async procReward( id, value) {
        let rewards = [];
        let user = this.dataMgr.user.get();
        let rewardType = this.rewardTypeCheck(id);
        let details = this.detailCheck(id);
        switch (rewardType) {
            case Const.REWARD_TYPES.GOODS:
                switch (details){
                    case Const.GOODS_DETAIL.GOLD:
                        user.gold += Number(value);
                        break;
                    case Const.GOODS_DETAIL.RUBY:
                        user.ruby += Number(value);
                }
                rewards.push(new Structs.Reward( id, value));
                break;

            case Const.REWARD_TYPES.SKILL:
                if (!user.prepareBuffCntPerId)
                    user.prepareBuffCntPerId = {};

                rewards.push(new Structs.Reward( id, value));
                break;

            case Const.REWARD_TYPES.MATERIAL:
                if (!CsvMgr.rewardGachas.exists(refId))
                    break;

                for (let i = 0; i < Number(ref); i++) {
                    let gachaRewards = CsvMgr.rewardGachas.getRewards(refId);
                    for (let reward of gachaRewards)
                        rewards.push(... await this.procReward(reward.refId, reward.ref));
                }

                break;
        }

        return rewards;
    }

    async getLevelByEquipmentsExp(type,exp){ //잡템일 경우 아이템 아이디를, 장비일 경우에는 고유 srl을
/*        let type = this.rewardTypeCheck(itemId);
        if(type !== Const.REWARD_TYPES.EQUIP && type !== Const.REWARD_TYPES.MATERIAL)
            return false; //이부분 에러 처리는 api 별로 해주는게 낫지 않나*/
        //let exp = 0;
        let expWeight = 0;
        if(type = Const.REWARD_TYPES.EQUIP)
            exp = 0;
        switch (type){
            case Const.REWARD_TYPES.MATERIAL :

                break;
            case Const.REWARD_TYPES.EQUIP :

                break;
        }

    }

    async rewardTypeCheck (id){
        let result = parseInt(Number(id) / 100000);
        return result;
    }

    async detailCheck(id){
        let result = Number(id) % 100000;
        return result;
    }

    async setElementAtt(user){ //이곳에 엘리멘탈 관련 최초 계산 식을 넣을 예정
        let result = {};


        return result;
    }


};

