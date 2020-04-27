/* ych 0422 */

const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();
    const Board_Write_Cost = await CsvMgr.global.BOARD_WRITE_COST_SP;
    
    let flag;
    let write = {};
    let TotalSiverPoop;
    let SiverPoop;
    let RemainSiverPoop;

   // ych 0427 memo키 유효성 검증
   if(!p.$existsKey('memo'))
   {
   return ctx.$.res.BadRequest();
   }

   // ych 0427 게시판 쓰기 잔액 TotalSiverPoop 변수에 저장
   TotalSiverPoop = await ctx.$.daoGame.boards.getSiverPoop(user.srl)
   
   // SiverPoop값만 가져오기
   SiverPoop = TotalSiverPoop.silverPoop;

   // 잔액이 쓰기 비용보다 적거나 알수 없는 값이면 에러 반환
   if((SiverPoop < Board_Write_Cost) && (TotalSiverPoop != 'undefined'))
   {
    return ctx.$.res.Fail(Const.API.BOARD.NOT_ENOUGH_COST);
   }
   else
   {
     RemainSiverPoop = TotalSiverPoop.silverPoop - Board_Write_Cost
    }
   // 전체 잔액 - 게시판 쓰기 비용
    

    await ctx.$.daoGame.boards.updateSiverPoop(user.srl, RemainSiverPoop)
  
    await ctx.$.daoGame.boards.insert(user.srl, p.memo);

    console.log("user 정보 :"+JSON.stringify(user));
    console.log("sessId :"+ ctx.$.params['sessId']);

    write.RemainSiverPoop = RemainSiverPoop;
    return ctx.$.res.Next(write);
};