const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

const FAIL_TYPE_EXIST_SAME_ID = 1;

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

	if (!p.$existsKey('id', 'pw'))
        return ctx.$.res.BadRequest();

	let targetUser = await ctx.$.daoGame.userInfo.getById(p.id);

	if(targetUser)
	{
		if(targetUser.srl != user.srl)
			return ctx.$.res.Fail(FAIL_TYPE_EXIST_SAME_ID);
	}
	
	user.id = p.id;
	user.pw = p.pw;

    return ctx.$.res.Next();
};