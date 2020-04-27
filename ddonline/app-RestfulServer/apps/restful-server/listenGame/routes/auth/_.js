const Const = require('uw-const');
const shortid   = require('shortid');
//const clientSync = require('../../../_configs/clientSync.json');
const fs = require('fs');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    let p = ctx.$.p;

    if (ctx.$.isDebug) {
        p.deviceId = null;
        p.platformType = Const.PLATFORM_TYPES.NONE;

        if (!('clientVer' in p) || !('csvVer' in p)){
            let clientSync = fs.readFileSync(__rootpath+'/apps/restful-server/_configs/clientSync.json','utf-8');
            clientSync = JSON.parse(clientSync);
            p.clientVer = clientSync.clientVer;
            p.csvVer =  Math.max.apply(Math,clientSync.csvVerInfo.map(function(o){return o.csvVer;}));
        }
    }
    if (!p.$existsKey('ch_type','ch_id'/* ,'deviceId', 'platformType'*/, 'clientVer', 'csvVer'))
        return ctx.$.res.BadRequest();


    p.ch_type        = Number(p.ch_type);  // channelType
    p.ch_id       = (p.ch_id === null) ? null : String(p.ch_id);  // channelRefId
    //p.deviceId          = (p.deviceId === null) ? null : String(p.deviceId);
    //p.platformType      = Number(p.platformType);
    p.clientVer         = Number(p.clientVer);
    p.csvVer            = Number(p.csvVer);

    //ctx.$.daoLog.restfulServerReqs.setDeviceId(p.deviceId);
    //ctx.$.daoLog.restfulServerReqs.setPlatformType(p.platformType);
    //ctx.$.daoLog.restfulServerReqs.setClientVer(p.clientVer);
    //ctx.$.daoLog.restfulServerReqs.setCsvVer(p.clientVer);

    if (!Const.CHANNEL_TYPES.$exists(p.ch_type))
        return ctx.$.res.BadRequest();

    /*if (!Const.PLATFORM_TYPES.$exists(p.platformType))
        return ctx.$.res.BadRequest();*/

    let r = await next(); //이곳까지 호출된 뒤에 regist,login 으로
    if (!r)
        return false;

    let user = ctx.$.dataMgr.user.get(); //세션

    /*if (p.deviceId) {
        if (!await ctx.$.daoGame.userDevices.exists(user.srl, p.deviceId, p.platformType))
            await ctx.$.daoGame.userDevices.insert(user.srl, p.deviceId, p.platformType);
    }*/

    let sessId = shortid.generate();
    let sessionResult =  await ctx.$.daoCache.sessions.set(sessId, user.srl, p.platformType, p.deviceId, p.clientVer, p.csvVer);
    //세션 중복값이 있을 경우에 새롭게 처리하는 방어코드
   if(sessionResult === false)
       sessId = await ctx.$.daoCache.sessions.sessionChange(sessId, user.srl, p.platformType, p.deviceId, p.clientVer, p.csvVer);

 /*   if ('characters' in r) {
        user.insideCharacterCnt = r.characters.filter(m => m.isInside).length;
    } */
 console.log(JSON.stringify(r.charInfo));
    ['charInfo'].forEach(key => { //userSrl 키값 제거 로직
        if (!(key in r))
            return;
        r[key].forEach(m => delete m.userSrl);
    });
   //최종 로그인 response 단

    ['items'].forEach(key => {
        if (!(key in r))
            return;
        r[key].forEach(m => delete m.userSrl);
    });
    let userCustomReturn = user.$copy(); //유저 regDate 값만 제외하고 return
    delete userCustomReturn.regDate;

   return ctx.$.res.Next({
       serverTime          : (new Date()).getTime(),
       sessId              : sessId,
       user                : userCustomReturn,
       charInfo            : ('charInfo' in r)? r.charInfo : []
       //items               : ('items' in r) ? r.items : []
    });
};
