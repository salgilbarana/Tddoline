/* ych 0422 */
const Const = require('uw-const');


// 게시판 상태 
const BOARD_STATE_NONE = 0;

//const dbGameSrv = mysql.createService(); //생성자

// 게시판 테이블 구조
class Struct {
    constructor(userSrl,memo){
        this.userSrl = userSrl;
        this.memo = memo;
        this.redate = Date.$nowSecs();
    }
}

// 클래스로 만듬
const Class = class {
    constructor(dbGameSrv){
        this.Struct = Struct;
        this.dbGameSrv = dbGameSrv;
    }

    async insert(userSrl, memo) {
        let db = await this.dbGameSrv.getShard();
        let boards = new Struct(userSrl, memo);
        let result = await db.insert('boards', boards);
       // if (result)
        //    item.srl = result[0].insertId
        //return item;
    }

    // ych 0424 name, accgp, wincnt, losecnt 가져오기 
    async getUserInfo(no, page_size){
        let db = await this.dbGameSrv.getShard();
        let args = [no];
        let userInfo = [];
        let sql ='SELECT userSrl FROM boards ORDER BY srl DESC LIMIT ?,?';
        
        args.push(page_size)
        
        let userSrl = await db.rows(sql,args);
        
        for(var i=0; i<userSrl.length; i++)
        {
            userInfo.push(await db.row('SELECT name,accGP,winCnt,loseCnt FROM userInfo',{srl:userSrl[i].userSrl}));
        }
        return userInfo;
    }

    // 전체 게시글 수 가져오기
    async getTotalCnt(){
        let db = await this.dbGameSrv.getShard();
        let data = await db.rows('SELECT count(*) AS cnt FROM boards',{})
        return await data[0].cnt;
    }

    // 10개의 게시글 가져오기 
    async getPage(no, page_size){
        let db = await this.dbGameSrv.getShard();
        let args = [no]
        let sql ='SELECT srl, memo, redate FROM boards ORDER BY srl DESC LIMIT ?,?';
        
        args.push(page_size)

        return await db.rows(sql,args);
    }
    
    // 0427 게시판 쓰기 잔액 확인
    async getSiverPoop(userSrl){
        let db = await this.dbGameSrv.getShard();
        let sql = 'SELECT silverPoop FROM userInfo WHERE srl =?';
        return db.row(sql, [userSrl]);
    }
    
    // 0427 게시판 쓰기 비용 차감
    async updateSiverPoop(userSrl, RemainCost)
    {
        let db = await this.dbGameSrv.getShard();
        let sql = 'UPDATE userInfo SET silverPoop = ? WHERE srl =?';
        await db.query(sql, [RemainCost, userSrl]);
    }
};

Class.Struct = Struct;
module.exports = Class;