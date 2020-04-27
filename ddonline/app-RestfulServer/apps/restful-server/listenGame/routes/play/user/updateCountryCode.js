const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

    if (!p.$existsKey('countryCode'))
        return ctx.$.res.BadRequest();

    p.countryCode = String(p.countryCode);

    user.countryCode = p.countryCode;

    return ctx.$.res.Next();
};