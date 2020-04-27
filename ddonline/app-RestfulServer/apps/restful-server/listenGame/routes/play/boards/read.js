/* ych 0423 */

/* ych 0424 
현재 페이지에 보여줄 데이터의 시작 번호 = (현재 페이지 -1 )* 출력갯수 +1
현재 페이지에 보여줄 데이터의 종료 번호 = 시작 번호 + 출력 갯수 -1
*/

const CsvMgr = require('uw-csvMgr');
const Const = require('uw-const');

const JsDocListenGameCtx = require('jsdoc-listenGameCtx');
/** @param {JsDocListenGameCtx} ctx */

module.exports = async(ctx, next) => {
    const p = ctx.$.p;
    const user = ctx.$.dataMgr.user.get();

    // ych 0427 cur키 유효성 검증
    if(!p.$existsKey('cur'))
    {
    return ctx.$.res.BadRequest();
    }
    // 요청페이지
    const current = p.cur;

// 페이지당 게시물 수 : 한페이지 당 10개 게시물
const page_size = 10;

// 페이지의 갯수 : 1~ 10개 페이지
//const page_list_size = 10;

// limit 변수
//let no = "";

// 전체 게시물의 숫자
let totalPageCount = 0;

totalPageCount = await ctx.$.daoGame.boards.getTotalCnt()

//console.log('현재 페이지: ' +  curPage, '전체 페이지:' + totalPageCount);

//if(totalPageCount < 0){
//    totalPageCount = 0;
//}


// 전체 페이지수
let totalPage = Math.ceil(totalPageCount / page_size);


if (current > totalPage)
{
    return ctx.$.res.Fail(Const.API.BOARD.INVALID_PAGE);
}
/*
// 전체 세트수
let totalSet = Math.ceil(totalPage / page_list_size);
// 현재 세트 번호
let curSet = Math.ceil(curPage / page_list_size);
// 현재 세트내 출력될 시작 
let startPage = ((curSet -1)*10) +1 ;
// 현재 세트내 출력될 마지막 페이지
let endPage = (startPage + page_list_size) -1 
*/


let boards = {};
let page
let firstOrder


// 현재 페이지가 0 보다 작으면
if( current <=1 ) {
    firstOrder = 0;
    
    
    page = await ctx.$.daoGame.boards.getPage(firstOrder, page_size);
    userInfo = await ctx.$.daoGame.boards.getUserInfo(firstOrder, page_size);

}else{
    firstOrder = (current-1)*page_size;

    page = await ctx.$.daoGame.boards.getPage(firstOrder, page_size);
    userInfo = await ctx.$.daoGame.boards.getUserInfo(firstOrder, page_size);
}


for(var i=0; i < page.length; i++)
{
    page[i].userInfo = userInfo[i];
}


    boards.page = page;
    return ctx.$.res.Next(boards);
};