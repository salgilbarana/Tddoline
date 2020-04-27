const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */


module.exports = async(ctx, next) => {

    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

    if (!p.$existsKey('upgradeItemSrl', 'materialItems')|| !Array.isArray(p.materialItems)) //materialItems 는 고유 아이템의 itemSrl 을 의미
        return ctx.$.res.BadRequest();
    p.upgradeItemSrl = Number(p.upgradeItemSrl);

    let upgradeItem = await ctx.$.daoGame.items.get(p.upgradeItemSrl,user.srl);
    if(!upgradeItem)
        return ctx.$.res.Fail(Const.API.LEVELUPITEM.NOT_EXISTS_ITEM);
    let materialItems = await ctx.$.daoGame.items.getsByItemSrl(p.materialItems,user.srl); //아이템 목록
    let totalExp = 0; //totalExp 를 이곳에 더해서 더해줄 예정

    for(let i =0; i<items.length; i++){
        let item_type = await ctx.$.dataMgr.util.detailCheck(items[i].id);

        switch (item_type){
            case Const.ITEM_TYPE.MATERIAL:
                //잡템 경험치 등의 처리 추가 예정
                break;
            case Const.ITEM_TYPE.EQUIP:
                //장비 경험치 등의 처리 추가 예정
                break;
        }
    }

};

