//암호화 복호화 부분
const crypto = require('crypto');
const connections = require('../../connections');
const Dao = require('uw-dao');
const Response = require('app-response');
const fs = require('fs');
const Const = require('uw-const');
//const clientSync = require('../../_configs/clientSync.json');//버전 라우트 테스트
const path = require('path');//버전 라우트 테스트
let clientSync = fs.readFileSync(__rootpath+'/apps/restful-server/_configs/clientSync.json','utf-8');
clientSync = JSON.parse(clientSync);

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async (ctx, next) => {

    let clientVer = '';
    let csvVer = '';
    ctx.$ = {
        startDate: new Date,
        isDebug: ('d' in ctx.query),
        params: (ctx.request.method === 'POST') ? ctx.request.body : ctx.query,
        p: {}
    };

    ctx.$.dbGameSrv = connections.dbGameServer.createContext({
        isLog: ctx.$.isDebug,
        isAutoBegin: true
    });
    ctx.$.dbLogSrv = connections.dbLogServer.createContext({
        isLog: ctx.$.isDebug,
        isAutoBegin: false
    });

    ctx.$.daoCache = new Dao.Cache(connections.dbCacheServer);
    ctx.$.daoGame = new Dao.Game(ctx.$.dbGameSrv);
    ctx.$.daoLog = new Dao.Log(ctx.$.dbLogSrv);

    ctx.$.res = new Response(ctx);

    if ('p' in ctx.$.params) {
        try {
            let p = ctx.$.params['p'];
            if (!ctx.$.isDebug) {
                let decipher = crypto.createDecipheriv('AES-128-CBC', 'NigeroTomoyo!@#$', '8321947192739743');
                p = decipher.update(ctx.$.params.p, 'hex', 'utf8') + decipher.final('utf8');
            }

            ctx.$.p = JSON.parse(p);
        } catch (e) {
            console.log(e);
            return ctx.$.res.BadRequest();
        }
        if (typeof ctx.$.p !== 'object')
            return ctx.$.res.BadRequest();
    }
    if (ctx.request.path.startsWith('/auth')) {
        clientVer = ctx.$.p.clientVer;
        csvVer = ctx.$.p.csvVer;
    }

    // 게시판 가져오기
    if(ctx.request.path.startsWith('/getboard/:id'))
    {
        console.log('파라미터 숫자' + {id} );
        return ctx.body = "getboard check";
    }
    // 게시판 쓰기 
    if(ctx.request.path.startsWith('/putboard/:id')){
        console.log('파라미터 숫자' + id );
        return ctx.body = "putboard check";
    }

    if (!ctx.request.path.startsWith('/open') && !ctx.request.path.startsWith('/auth')) { //open 과 auth가 아닐때 sessId 를 가지고 클라 버전을 체크
        if (!('sessId' in ctx.$.params))
            return  ctx.$.res.Fail(Const.FAIL_TYPES.NOT_EXISTS_SESSION_ID);

        let sessId = ctx.$.params['sessId'];

        let userSrlSess = await ctx.$.daoCache.sessions.getUserSrlBySessId(sessId);
        if (!userSrlSess)
            return ctx.$.res.Fail(Const.FAIL_TYPES.EXPIRED_SESSION);

        let sess = await ctx.$.daoCache.sessions.get(userSrlSess); //세션 추출
        if (!sess)
            return ctx.$.res.Fail(Const.FAIL_TYPES.EXPIRED_SESSION);

        clientVer = sess.clientVer; //세션값에 있는 클라이언트 버전 적용
        csvVer = sess.csvVer; //세션값에 있는 csv 버전 적용

        console.log("클라버전 " + clientVer);
        let routeArray = ctx.request.path.split("/");
        routeArray.splice(routeArray.length - 1, 0, clientVer); //p에 clientVer 정보가 있을 경우에는 해당 버전을 없을 경우 서버가 가지고 있는 clientVer 을
        let routeArrayResult = routeArray.join('/');
        let pathResult = path.join(__dirname, '../routes', routeArrayResult + '.js'); //해당 버전에 맞는 폴더의 파일 path
        console.log("라우트 폴더,파일유무 :" + fs.existsSync(pathResult));
        if (fs.existsSync(pathResult)) { //파일이 있을 경우 해당 js를 path로 변경
            ctx.request.path = routeArrayResult;
            console.log("리절트 :" + JSON.stringify(ctx.request.path));
        }
    }
    if (!ctx.$.isDebug) {
    if (Number(clientVer) < Number(clientSync.minClientVer))
        return ctx.$.res.Fail(Const.FAIL_TYPES.CLIENT_UPDATE);

    for (let i = 0; i < clientSync.csvVerInfo.length; i++) {
        if (Number(clientSync.csvVerInfo[i].clientVer) === Number(clientVer)
            && Number(clientSync.csvVerInfo[i].csvVer) !== Number(csvVer)) {
            return ctx.$.res.Fail(Const.FAIL_TYPES.CSV_UPDATE);
        }
    }
    }

    await next();
};