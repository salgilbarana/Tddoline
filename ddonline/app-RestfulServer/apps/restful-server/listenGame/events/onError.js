module.exports = async (err, ctx) => {
    //ctx.body = err.name;
    ctx.status = err.status ? err.status : 500;
    
    console.error('[Error]', ctx.status, ctx.request.href, (ctx.request.method === 'POST') ? ctx.request.body : ctx.query);

    if (ctx.status === 500)
        console.error(err.stack);

    //if (!ctx.$.isDebug) {
        try {
            ctx.throw(err.status, err.message);
        } catch (e) {
            //console.error(e);
        }
    //}
};