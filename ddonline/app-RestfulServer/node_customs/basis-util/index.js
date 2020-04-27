const util = require('util');
const fs = require('fs');
const fsReadFile = util.promisify(fs.readFile);
const babyParse = require('babyparse');

module.exports = {
    loadVerticalCsv : async (file, opt) => {
        opt = {
            headerLine : ('headerLine' in opt) ? opt.headerLine : 0,
            limit : ('limit' in opt) ? opt.limit : null,
            keys : ('key' in opt) ? (Array.isArray(opt.key) ? opt.key : [opt.key]) : null,
            value : ('value' in opt) ? opt.value : null,
            nullVal : ('nullVal' in opt) ? opt.nullVal : null,
            isArrayVal : ('isArrayVal' in opt) ? opt.isArrayVal : false,
            delimiter : ('delimiter' in opt) ? opt.delimiter : ','
        };

        let fileContents = (await fsReadFile(file)).toString();

        var parsed = babyParse.parse(fileContents ,{
            delimiter: opt.delimiter,
            header : true,
            skipEmptyLines: true
        });

        if (parsed.errors.length > 0)
            throw parsed.errors;

        if (opt.value === null)
            opt.value = parsed.meta.fields[parsed.meta.fields.length - 1];

        var result = {};
        parsed.data.forEach(row => {
            if (row[opt.value] === '' || row[opt.value] === opt.nullVal)
                row[opt.value] = null;

            let target = result;
            for (let i=0; i<opt.keys.length; i++) {
                var key = row[opt.keys[i]];
                if (i < opt.keys.length - 1) {
                    if (!(key in target))
                        target[key] = {};

                    target = target[key];
                    continue;
                }

                if (opt.isArrayVal) {
                    if (!(key in target))
                        target[key] = [];

                    target[key].push(row[opt.value]);
                } else {
                    target[key] = row[opt.value];
                }
            }
        });

        return result;
    },

    loadCsv : async (file, opt) => {
        opt = {
            headerLine : ('headerLine' in opt) ? opt.headerLine : 0,
            limit : ('limit' in opt) ? opt.limit : null,
            //columns : ('columns' in opt) ? opt.columns : null,
            keys : ('key' in opt) ? (Array.isArray(opt.key) ? opt.key : [opt.key]) : null,
            nullVal : ('nullVal' in opt) ? opt.nullVal : null,
            filter : ('filter' in opt) ? opt.filter : null,
            isArrayVal : ('isArrayVal' in opt) ? opt.isArrayVal : false,
            delimiter : ('delimiter' in opt) ? opt.delimiter : ','
        };

        var fileContents = await fsReadFile(file);
        var rows = fileContents.toString().split('\r\n');
        for (var i=0; i<opt.headerLine; i++)
            rows.shift();

        if (opt.limit)
            rows.length = opt.headerLine + opt.limit;

        fileContents = rows.join('\r\n');

        var parsed = babyParse.parse(fileContents ,{
            delimiter: opt.delimiter,
            header : true,
            skipEmptyLines: true
        });

        if (parsed.errors.length > 0)
            throw parsed.errors;

        var result = {};

        parsed.data.forEach(row => {
            for (let key in row) {
                if (row[key] !== '' && row[key] !== opt.nullVal)
                    continue;

                row[key] = null;
            }

            var m = row;
            if (opt.filter)
                m = opt.filter(m);

            var target = result;

            for (var i=0; i<opt.keys.length; i++) {
                let key = opt.keys[i];
                if (i < opt.keys.length - 1) {
                    if (!(row[key] in target))
                        target[row[key]] = {};

                    target = target[row[key]];
                    continue;
                }

                if (opt.isArrayVal) {
                    if (!(row[key] in target))
                        target[row[key]] = [];

                    target[row[key]].push(m);
                } else {
                    target[row[key]] = m;
                }
            }
        });

        return result;
    }
};