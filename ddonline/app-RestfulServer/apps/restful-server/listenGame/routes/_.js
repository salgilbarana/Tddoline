const Const     = require('uw-const');
const CsvMgr    = require('uw-csvMgr');
const DataMgr = require('app-dataMgr');
const Structs = require('app-structs');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    ctx.$.dataMgr = new DataMgr(ctx.$.daoGame, ctx.$.daoCache);

    //모든 API 막기.(탐험종료 제외)
    /*let ip = String(ctx.request.ip);
   if (ip !== '::ffff:121.130.198.131'&& ip !=='::ffff:106.248.237.90' && ctx.request.path !== '/play/explore/exit'&& ctx.request.path !== '/play/mission/progress'){
       return ctx.$.res.Fail(Const.FAIL_TYPES.CONSTRUCTION,'14:00 ~ 14:30');
   }*/

    let r = await next();
    if (!r)
        return false;


    let updateData = await ctx.$.dataMgr.saveDb();
    if (updateData) {
        if ('user' in updateData)
            ctx.$.res.setGlobal('onUser', updateData.user);
    }

    return ctx.$.res.Success();
};