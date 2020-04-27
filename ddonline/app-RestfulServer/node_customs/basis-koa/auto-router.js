const path = require('path');
const slash = require('slash');
const glob = require('glob');
const KoaRouter = require('koa-router');

module.exports = (routePath, opt) => {
    var routePath = path.normalize(routePath);
    var router = new KoaRouter();

    var files = glob.sync(routePath + '/**/*.js');
    for (var i=0; i<files.length; i++)
        files[i] = files[i].replace(slash(routePath), '');

    var repeaterFiles = files.filter(m => {
        return (m.substr(-4) === '_.js');
    });

    var apiFiles = files.filter(m => {
        return (m.substr(-4) !== '_.js');
    });

    /*router.use('/', async (ctx, next) => {
        var err = null;
        var data = null;
        try {
            //await opt.onConnect(ctx);
            data = await next(1,2,3,4,5,6);
        } catch (e) {
            err = e;
            await opt.onError(e, ctx);
        }
        await opt.onClose(err, ctx, data);
    });*/

    repeaterFiles.forEach(m => {
        var func = require(routePath + m);
        var route = m.substr(0, m.length - 5);
        router.use(route, func);
    });

    apiFiles.forEach(m => {
        var func = require(routePath + m);
        var route = m.substr(0, m.length - 3);
        router.get(route, func);
        router.post(route, func);
    });

    return router.routes();
};
