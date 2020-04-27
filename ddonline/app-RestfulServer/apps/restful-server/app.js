require('../init-node.js')(__dirname);
require('shortid').worker(process.pid);

//if (process.argv.length < 3)
//    return;

//let port = process.argv[2];
let CsvMgr = require('uw-csvMgr'); //csv 매니저 호출
    CsvMgr.init();

//require('./listenGame')(port);
require('./listenGame')(13005);
