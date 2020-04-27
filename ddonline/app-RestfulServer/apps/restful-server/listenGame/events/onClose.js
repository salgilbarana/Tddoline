const crypto = require('crypto');
const ejs = require('ejs');

module.exports = async (err, ctx) => {
    ctx.$.execMs = new Date - ctx.$.startDate;
 /*   try {
        if (ctx.$.daoLog.payments.exists())
            await ctx.$.daoLog.payments.insert();

        if (ctx.request.path !== '/play/post/gets') {
            await ctx.$.daoLog.restfulServerReqs.insert(
                ctx.request.path,
                ctx.$.p.$isEmpty() ? null : ctx.$.p,
                (err && 'status' in err) ? err.status : ctx.status,
                ctx.body,
                (ctx.body && 'err' in ctx.body) ? ctx.body.err.type : 0,
                ctx.request.ip,
                ctx.$.execMs
            );
        }
    } catch (e) {
        /!*ctx.status = 500;
        ctx.$.res.isSuccess = false;*!/
        console.error(e.stack);
    }*/

    if (ctx.$.res.isSuccess) {
        await ctx.$.dbGameSrv.ifCommit();
    } else {
        await ctx.$.dbGameSrv.ifRollback();
    }

    await ctx.$.dbGameSrv.ifRelease();
   //await ctx.$.dbLogSrv.ifRelease(); 나중에 로그사용시 해제


    if (ctx.$.isDebug) {
        ctx.set('Content-Type', 'text/html;charset=UTF-8');
        //ctx.status = (err) ? err.status : ctx.status;

        let headers = {
            status : ctx.status,
            execMs : ctx.$.execMs
        };

        ejs.renderFile(__dirname + '/onDebug.html', {
            headers : headers,
            res : ctx.body,
            dbGameLogs : ctx.$.dbGameSrv.getLogs(),
            daoCacheLogs : ctx.$.daoCache.getLogs(),
            err : err
        }, (err, str) => {
            if (err) {
                console.error(err);
                return;
            }

            ctx.body = str;
        });
    } else {
        if (ctx.body && !ctx.request.path.startsWith('/callback')) { //callback 으로 시작하는 요청에는 암호화 안함
            let cipher = crypto.createCipheriv('AES-128-CBC', 'NigeroTomoyo!@#$', '8321947192739743');
            ctx.body = cipher.update(JSON.stringify(ctx.body), 'utf8', 'hex') + cipher.final('hex');
        } //암호화 적용 다시 예정
    }
};
