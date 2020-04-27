const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const FAIL_TYPE_NOT_EXISTS_USER = 1;

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();
    let result =[];

/*    if (!p.$existsKey('channel'))
        return ctx.$.res.BadRequest();*/

    if (!Array.isArray(p.channel))
        return ctx.$.res.BadRequest();
//    p.channel[0]        = Number(p.channel[0]);  // channelType
//    p.channel[1]        = (p.channel[1] === null) ? null : String(p.channel[1]);  // channelRefId

    for(let i= 0; i<p.channel.length; i++){
        let tmp = [];

        p.channel[i][1] =  (p.channel[i][1] === null) ? null : String(p.channel[i][1]);

        let channelUser = await  ctx.$.daoGame.userInfo.getByChannel(Number(p.channel[i][0]),p.channel[i][1]);

/*        if(!channelUser.name || !channelUser.channelRefId){
            return ctx.$.res.Fail(FAIL_TYPE_NOT_EXISTS_USER);
        }*/
        tmp.push(channelUser != null ? channelUser.name : '' , p.channel[i][1]);
        //tmp.push(channelUser.name , p.channel[i][1]);

        result.push(tmp);
    }

//    let channelUser = await ctx.$.daoGame.users.getByChannel(p.channel[0], p.channel[1]);
//    if (!channelUser)
//        return ctx.$.res.Fail(FAIL_TYPE_NOT_EXISTS_USER);

    return ctx.$.res.Next({
        channels : result
    });

};