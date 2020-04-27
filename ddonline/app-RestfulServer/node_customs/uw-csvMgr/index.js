// csv file 관련 설정
const fs = require('fs');
const csvPath = __dirname + '/../../data/designs';
//ych 0422
//let equipInitCsvList = fs.readFileSync('../../apps/restful-server/_configs/equipInitCsvList.json');
//equipInitCsvList  = JSON.parse(equipInitCsvList);
let equipInitCsvList = ["item_equip.csv","item_equip_test1.csv","item_equip_test2.csv"]
// 
let isInit = false;

module.exports = {
    init() {
        if (isInit)
            return;

        isInit = true;

        let sheetPerName = {};
        let equipmentsResult = [];

        fs.readdirSync(csvPath).forEach(file => {
            let contents = fs.readFileSync(csvPath + '/' + file).toString();
            let rows = contents.split('\r\n');
            let result = [];
            let header = null;
            rows.forEach((row, i) => {
                if (row.trim().length === 0)
                    return;
                if( i === 1) // 타이탄 csv에 있는 자료형 정의된 부분은 패스
                    return ;
                let fields = row.split(';');
                if (header === null) {
                    header = fields;
                    return;
                }

                let resultRow = {};
               fields.forEach((field, i) => {
                    resultRow[header[i]] = field;
                });
               if(equipInitCsvList.indexOf(file) >=0){ //equipments 부분같은 경우 하나로 합쳐서 진행
                   equipmentsResult.push(resultRow);
                   return;
               }
                result.push(resultRow);
            });
            if(equipInitCsvList.indexOf(file) >=0) return;
            sheetPerName[file] = result;
        });

        this.equipments.init(equipmentsResult); //equipments 는 장비 관련 csv를 하나로 equipInitCsvList.json에서 통합 관리
        this.global.init(sheetPerName['global.csv']);
        this.character.init(sheetPerName['character.csv']);

    },
    equipments : require('./designs/equipments'),
    global : require('./designs/global'),
    character : require('./designs/character')


};