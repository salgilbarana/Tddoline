const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */
const EQUIP = 1;
const UNEQUIP = 2;

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

    if (!p.$existsKey('itemSrl','state')) // state 1 은 착용 2 는 해제
        return ctx.$.res.BadRequest();
    p.itemSrl = Number(p.itemSrl);
    p.state = Number(p.state);

    let item = await ctx.$.daoGame.items.getByItemSrl(p.itemSrl,user.srl); //아이템 srl로 이 아이템의 id를 가져옴
    if(!item)
        return ctx.$.res.Fail(Const.API.EQUIP.NOT_EXIST_ITEM);
    //csv 상에서 아이템 id를 가지고와서 있는 아이템인지 체크하는 로직 추가 할 예정
    let equip_type = await ctx.$.dataMgr.util.detailCheck(item.id); //첫자리수로 아이템 타입 판별
    if(!Const.EQUIPMENTS_TYPE.$exists(equip_type))
        return ctx.$.res.Fail(Const.API.EQUIP.NOT_RIGHT_EQUIPMENTS_TYPE);

    if(p.state === EQUIP){ // item 변경 시작
        if (!user.equipments){
            let result = {};
            result[equip_type] = p.itemSrl;
            user.equipments = result;
        }else{
            if( user.equipments[equip_type] == p.itemSrl)
                return ctx.$.res.Fail(Const.API.EQUIP.SAME_ITEM);
            user.equipments[equip_type] = p.itemSrl;
        }
    }else if(p.state === UNEQUIP){
        if(user.equipments[equip_type] != p.itemSrl)
            return  ctx.$.res.Fail(Const.API.EQUIP.NOT_SAME_ITEM);
        delete  user.equipments[equip_type];
    }else
        return  ctx.$.res.Fail(Const.API.EQUIP.NOT_RIGHT_STATE_TYPE);

    return ctx.$.res.Next();
};