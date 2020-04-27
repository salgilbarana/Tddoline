const clientSync = require('../../../_configs/clientSync.json');
const fs = require('fs');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async (ctx, next) => {

    let params = ctx.$.params;
    console.log(__rootpath);

    await fs.writeFileSync(__rootpath+'/apps/restful-server/_configs/clientSync.json',JSON.stringify(params['versionInfo']),'utf8');

    return ctx.$.res.Success();
};