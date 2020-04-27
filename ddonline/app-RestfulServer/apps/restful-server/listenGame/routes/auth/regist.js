const Const     = require('uw-const');
const CsvMgr    = require('uw-csvMgr');
const uuid    = require('uuid/v4');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    if (!p.$existsKey('name')){
        return ctx.$.res.BadRequest();
    }
    p.name = String(p.name);
    let ch_id = p.ch_id;

    if (ch_id === '') {
        if (p.ch_type !== Const.CHANNEL_TYPES.NONE)
            return ctx.$.res.BadRequest();
        ch_id = uuid();
    }

    if (await ctx.$.daoGame.userInfo.existsByChannel(p.ch_type, ch_id))
        return ctx.$.res.Fail(Const.API.REGIST.ALREADY_REGIST);

    if (await ctx.$.daoGame.userInfo.existsByName(p.name))
        return ctx.$.res.Fail(Const.API.REGIST.ALREADY_NAME);

    let user = await ctx.$.daoGame.userInfo.insert(p.ch_type, ch_id, p.name);

    ctx.$.dataMgr.user.set(user);
    // ctx.$.daoLog.restfulServerReqs.setUserSrl(user.srl); //로그 필요할 경우 진행
    let character = new ctx.$.daoGame.charInfo.Struct(user.srl);
    await ctx.$.daoGame.charInfo.inserts(character);
    let dbCharacter = await ctx.$.daoGame.charInfo.gets(user.srl);
    user.charSrl = dbCharacter[0].srl;

    let response = {
        charInfo : await dbCharacter
        //items : await ctx.$.daoGame.items.getsAll(user.srl)
    };
    return response;
};