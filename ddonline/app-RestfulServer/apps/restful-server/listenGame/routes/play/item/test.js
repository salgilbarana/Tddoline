const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

    console.log("user 정보 :"+JSON.stringify(user));
    console.log("sessId :"+ ctx.$.params['sessId']);
    /*if (!p.$existsKey('test'))
        return ctx.$.res.BadRequest();*/

    return ctx.$.res.Next();

};