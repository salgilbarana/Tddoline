const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');
const fs = require('fs');
//const clientSync = require('../../../_configs/clientSync.json');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    let versionJson = fs.readFileSync(__rootpath+'/apps/restful-server/_configs/clientSync.json','utf-8');

    return ctx.$.res.Next(JSON.parse(versionJson));
};