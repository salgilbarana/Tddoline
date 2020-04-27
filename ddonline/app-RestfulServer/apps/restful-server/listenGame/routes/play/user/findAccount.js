const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

const FAIL_TYPE_SAME_YOUR_OWN_ID = 1;
const FAIL_TYPE_NOT_EXIST_ID = 2;

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

	if (!p.$existsKey('id', 'pw'))
        return ctx.$.res.BadRequest();

	let targetUser = await ctx.$.daoGame.userInfo.getByIdPw(p.id, p.pw);

	if(targetUser)
	{
		if(targetUser.srl == user.srl)
			return ctx.$.res.Fail(FAIL_TYPE_SAME_YOUR_OWN_ID);
	}
	else
		return ctx.$.res.Fail(FAIL_TYPE_NOT_EXIST_ID);
	
	let result = {};
	result.srl = targetUser.srl;
	result.nickName = targetUser.name;

    return ctx.$.res.Next(result);
};