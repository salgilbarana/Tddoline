const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const FAIL_TYPE_NOT_EXISTS_USER = 1;

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

    if (!p.$existsKey('channel'))
        return ctx.$.res.BadRequest();

    if (!Array.isArray(p.channel) || p.channel.length < 2)
        return ctx.$.res.BadRequest();

    p.channel[0]        = Number(p.channel[0]);  // channelType
    p.channel[1]        = (p.channel[1] === null) ? null : String(p.channel[1]);  // channelRefId

    let channelUser = await ctx.$.daoGame.userInfo.getByChannel(p.channel[0], p.channel[1]);
    if (!channelUser)
        return ctx.$.res.Fail(FAIL_TYPE_NOT_EXISTS_USER);

    return ctx.$.res.Next({
        userName : channelUser.name
    });
};