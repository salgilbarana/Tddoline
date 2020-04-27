const fs = require('fs');
const xlsx = require('xlsx');

let sheetPerNamePerExcelFile = {};

module.exports = {
    get(excelFile, sheetName) {
        if (!fs.existsSync(excelFile))
            return null;

        var excelFile = fs.realpathSync(excelFile);

        if (!(excelFile in sheetPerNamePerExcelFile)) {
            let xls = xlsx.readFile(excelFile);
            sheetPerNamePerExcelFile[excelFile] = {};

            let sheetPerName = sheetPerNamePerExcelFile[excelFile];

            for (let name in xls.Sheets) {
                sheetPerName[name] = xlsx.utils.sheet_to_json(xls.Sheets[name], {range:1});
                sheetPerName[name].forEach(m => {
                    for (let key in m) {
                        if (m[key] !== 'none')
                            continue;

                        m[key] = null;
                    }
                });
            }
        }

        if (!(sheetName in sheetPerNamePerExcelFile[excelFile]))
            return null;

        return sheetPerNamePerExcelFile[excelFile][sheetName];
    }
};