const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */


module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

    if (!p.$existsKey('items')|| !Array.isArray(p.items))
        return ctx.$.res.BadRequest();

    for (let m of p.items) {
        if (!Array.isArray(m))
            return ctx.$.res.BadRequest();

        m[0] = Number(m[0]);
        m[1] = Number(m[1]);
    }

    let itemIds = p.items.map(m => m[0]);
    if(await ctx.$.daoGame.items.countMatch(itemIds,user.srl) === false) //전달받은 아이템 종류 카운터와 실제 쿼리 카운트가 다를경우
        return ctx.$.res.Fail(Const.API.SELL.NOT_RIGHT_ITEM_CNT);

    let items = await ctx.$.daoGame.items.getsByItemSrl(itemIds, user.srl);
    for(let i = 0; i < p.items.length; i++){
        let item ={};
        item = items.find(a => a.itemSrl === p.items[i][0]);  //items 결과에서 itemSrl 찾음
        let item_type = await ctx.$.dataMgr.util.rewardTypeCheck(item.itemId); //type은 itemId로
        if(!Const.ITEM_TYPE.$exists(item_type))
            return ctx.$.res.Fail(Const.API.SELL.NOT_RIGHT_ITEM_TYPE);

        switch (item_type){
            case Const.ITEM_TYPE.MATERIAL:
                console.log("잡템");
                //잡템 판매 골드, 경험치 등의 처리 추가 예정
                break;
            case Const.ITEM_TYPE.EQUIP:
                console.log("장비");
                //장비 판매 골드 ,경험치 등의 처리 추가 예정
                //장비일 경우에는 user 테이블 참고해서 현재 착용중인 아이템은 판매 안해야함
                break;
        }

        //공통 모듈 처리
        item.cnt -= p.items[i][1];
        if (item.cnt < 0)
            return ctx.$.res.Fail(Const.API.SELL.NOT_ENOUGH_ITEM_CNT);

        if (item.cnt === 0)
            await ctx.$.daoGame.items.remove(item.itemSrl,user.srl);
        else
            await ctx.$.daoGame.items.update(item.itemSrl,user.srl,{cnt:item.cnt});
    }

    return ctx.$.res.Next({
        changeItem :  await ctx.$.daoGame.items.getsByItemSrl(itemIds, user.srl)
    });

};