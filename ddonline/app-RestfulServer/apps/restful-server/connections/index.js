module.exports = {
    dbCacheServer : require('./dbCacheServer'),
    dbLogServer : require('./dbLogServer'),
    dbGameServer : require('./dbGameServer')
};

let mapper = (m) => {
    for (let column in m) {
        if (!/^is/.test(column))
            continue;

        m[column] = Boolean(m[column]);
    }
};

module.exports.dbGameServer.setMapper(mapper);