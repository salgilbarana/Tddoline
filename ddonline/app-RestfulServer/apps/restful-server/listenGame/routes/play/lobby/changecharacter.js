const Const  = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */


module.exports = async(ctx, next) => {

    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();
    if(!p.$existsKey('charSrl'))
        return ctx.$.res.BadRequest();

    p.charSrl = Number(p.charSrl);
    if(p.charSrl === Number(user.charSrl))
        return  ctx.$.res.Fail(Const.API.LOBBY.ALREADY_MAIN_CHARACTER);

    if(!await ctx.$.daoGame.charInfo.exists(p.charSrl,user.srl))
        return ctx.$.res.Fail(Const.API.LOBBY.NOT_EXISTS_CHARACTER);

    let character = await ctx.$.daoGame.charInfo.get(p.charSrl,user.srl);
    user.charSrl = character.srl;

    return ctx.$.res.Next();
};