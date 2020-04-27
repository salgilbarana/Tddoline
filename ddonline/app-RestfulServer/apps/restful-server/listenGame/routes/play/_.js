const Const     = require('uw-const');
const CsvMgr    = require('uw-csvMgr');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
   /* if (!('sessId' in ctx.$.params))
        return ctx.$.res.BadRequest(); onConnect 에서 처리*/
    let csvVersion = 0;
    let sessId = ctx.$.params['sessId'];

    let userSrlSess =  await ctx.$.daoCache.sessions.getUserSrlBySessId(sessId); //세션값으로 userSrl 값 추출
    if(!userSrlSess)
        return ctx.$.res.Fail(Const.FAIL_TYPES.EXPIRED_SESSION);

    let sess = await ctx.$.daoCache.sessions.get(userSrlSess); //세션 추출
    let sessTTL = await ctx.$.daoCache.sessions.getSessionTTL(userSrlSess); //세션 ttl 값
    if (!sess)
        return ctx.$.res.Fail(Const.FAIL_TYPES.EXPIRED_SESSION);

/*    ctx.$.daoLog.restfulServerReqs.setSessId(sessId); log 세팅
    ctx.$.daoLog.restfulServerReqs.setDeviceId(sess.deviceId);
    ctx.$.daoLog.restfulServerReqs.setPlatformType(sess.platformType);
    ctx.$.daoLog.restfulServerReqs.setUserSrl(sess.userSrl);
    ctx.$.daoLog.restfulServerReqs.setClientVer(sess.clientVer);
    ctx.$.daoLog.restfulServerReqs.setCsvVer(sess.csvVer);*/

    let user = await ctx.$.daoGame.userInfo.get(sess.userSrl);
    if (!user)
        return ctx.$.res.Fail(Const.FAIL_TYPES.EXPIRED_SESSION);

    ctx.$.sess = sess;
    ctx.$.dataMgr.user.set(user);

    if (Number(sessTTL) < 1000) //ttl 값이 1000 이하로 expire 되기 전에 refresh 작업
       await ctx.$.daoCache.sessions.refreshExpireDate(user.srl, sessId);

    return await next();
};