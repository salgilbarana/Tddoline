const Const  = require('uw-const');
const CsvMgr = require('uw-csvMgr');
const Helper = require('uw-helper');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    p.ch_id = String(p.ch_id);
    p.ch_type = Number(p.ch_type);
    console.log("ch_id :"+p.ch_id+" ch_type :"+p.ch_type);
    let user = await ctx.$.daoGame.userInfo.getByChannel(p.ch_type, p.ch_id);
    if (!user)
        return ctx.$.res.Fail(Const.API.LOGIN.NOT_EXIST_USER);

    ctx.$.dataMgr.init(user);
 //   ctx.$.daoLog.restfulServerReqs.setUserSrl(user.srl);
    let sess = await ctx.$.daoCache.sessions.get(user.srl);
    if (sess)
        await ctx.$.daoCache.sessions.remove(user.srl,sess.sessId);

    let response = {
        charInfo : await ctx.$.daoGame.charInfo.gets(user.srl)
        //items : await ctx.$.daoGame.items.getsAll(user.srl)
    };
    return response;
};