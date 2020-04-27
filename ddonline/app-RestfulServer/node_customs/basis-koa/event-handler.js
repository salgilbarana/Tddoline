module.exports = (opt) => {
    return async (ctx, next) => {
        let err = null;
        let data = null;

        try {
            await opt.onConnect(ctx, next);
        } catch (e) {
            err = e;
            await opt.onError(e, ctx);
        }

        await opt.onClose(err, ctx, data);
    };
}