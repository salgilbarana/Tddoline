const fs = require('fs');

module.exports = (path) => {
    let paths = [];
    let rootpath = fs.realpathSync(path + '/../..');

    paths.push(rootpath + '/node_customs');

    if (fs.existsSync(path + '/node_customs'))
        paths.push(fs.realpathSync(path + '/node_customs'));

    global.__rootpath = rootpath;
    process.env.TZ = 'Asia/Seoul';
    process.env.NODE_PATH = paths.join(require('os').platform().toUpperCase().startsWith('WIN') ? ';' : ':');
    require('module').Module._initPaths();
    require('basis-prototypes');

    process.on('uncaughtException', (err) => {
        console.error('[uncaughtException]', err);  // name, message, stack
    });
    process.on('warning', (warn) => {
        console.warn(warn); // name, message, stack
    });
};