Object.defineProperties(Array.prototype, {
    $exists : {
        enumerable: false,
        value: function (...args) {
            for (var i=0; i<args.length; i++) {
                if (this.indexOf(args[i]) > -1)
                    continue;

                return false;
            }

            return true;
        }
    },
    $desc : {
        enumerable: false,
        value: function (fn) {
            this.sort((a, b) => fn(a) + fn(b));
            return this;
        }
    },
    $asc : {
        enumerable: false,
        value: function (fn) {
            this.sort((a, b) => fn(a) - fn(b));
            return this;
        }
    },
    $unique : {
        enumerable: false,
        value: function (filter) {
            let targets = this;
            let isFilter = (typeof filter === 'function');
            if (isFilter)
                targets = this.map(filter);

            return this.filter(function (value, index, self) { 
                if (isFilter)
                    value = filter(value);

                return targets.indexOf(value) === index;
            });
        }
    },
    $isUnique : {
        enumerable: false,
        value: function () {
            return (this.length === this.$unique().length);
        }
    },
    $shuffle : {
        enumerable : false,
        value : function() {
            let ctr = this.length;
        
            while (ctr > 0) {
                let index = Math.floor(Math.random() * ctr);
                ctr--;
                let temp = this[ctr];
                this[ctr] = this[index];
                this[index] = temp;
            }

            return this;
        }
    },
    $rand : {
        enumerable: false,
        value: function () {
            if (this.length === 0)
                return null;
            
            const idx = Math.$rand(0, this.length - 1);
            return this[idx];
        }
    },
    $fix : {
        enumerable: false,
        value: function (length, value) {
            for (var i=this.length; i<length; i++)
                this[i] = value;

            this.length = length;
            return this;
        }
    },
    $limit : {
        enumerable: false,
        value: function (length) {
            this.length = Math.min(this.length, length);
            return this;
        }
    },
    $sum : {
        enumerable: false,
        value: function (filter) {
            let isFilter = (typeof filter === 'function');
            let result = 0;
            this.forEach(v => {
                result += isFilter ? filter(v) : v;
            });

            return result;
        }
    },
    $diff : {
        enumerable: false,
        value: function (targets) {
            let result = [];
            for (let i=0; i<this.length; i++) {
                if (targets.indexOf(this[i]) > -1)
                    continue;

                result.push(this[i]);
            }

            return result;
        }
    },
    $copy : {
        enumerable: false,
        value: function () {
            let r = this.slice(0);
            for(let i=0; i<r.length; i++) {
                if (typeof r[i] === 'object') {
                    r[i] = r[i].$copy();
                    continue;
                }

                r[i] = r[i];
            }

            return r;
        }
    },
    $toObjectVertical : {
        enumerable: false,
        value: function (key, value) {
            let result = {};
            this.forEach(m => { result[m[key]] = m[value]; });
            return result;
        }
    },
    $toObject : {
        enumerable: false,
        value: function (keys, isArrayVal) {
            isArrayVal = (typeof isArrayVal !== 'undefined') ? isArrayVal : false;

            let result = {};
            this.forEach(m => {
                var target = result;
    
                for (var i=0; i<keys.length; i++) {
                    let key = keys[i];
                    if (i < keys.length - 1) {
                        if (!(m[key] in target))
                            target[m[key]] = {};
    
                        target = target[m[key]];
                        continue;
                    }
    
                    if (isArrayVal) {
                        if (!(m[key] in target))
                            target[m[key]] = [];
    
                        target[m[key]].push(m);
                    } else {
                        target[m[key]] = m;
                    }
                }
            });

            return result;
        }
    },
    $getInsertedRowsFrom : {
        enumerable: false,
        value: function(origins, pk) {
            let pks = Array.isArray(pk) ? pk : [pk];
            return this.filter(row => {
                let samePkOrigin = origins.find(origin => origin && pks.every(pk => origin[pk] === row[pk]));
                return !samePkOrigin;
            });
        }
    },
    $getRemovedRowsFrom : {
        enumerable: false,
        value: function(origins, pk) {
            let pks = Array.isArray(pk) ? pk : [pk];
            return origins.filter(origin => {
                let samePkRow = this.find(row => row && pks.every(pk => origin[pk] === row[pk]));
                return !samePkRow;
            });
        }
    },
    $getModifiedRowsFrom : {
        enumerable: false,
        value: function(origins, pk) {
            let result = [];
            let pks = Array.isArray(pk) ? pk : [pk];

            origins.forEach(origin => {
                let samePkRow = this.find(row => row && pks.every(pk => origin[pk] === row[pk]));
                if (!samePkRow)
                    return;

                let onData = {};
                
                for (let column in origin) {
                    if (pks.indexOf(column) > -1)
                        continue;

                    if (!(column in samePkRow))
                        continue;

                    if(typeof origin[column] === 'object' && origin[column] && samePkRow[column] && !origin[column].$isDiff(samePkRow[column]))
                        continue;

                    if (origin[column] === samePkRow[column])
                        continue;

                    onData[column] = samePkRow[column];
                }

                if (!onData.$isEmpty()) {
                    let data = {};
                    pks.forEach(pk => { data[pk] = samePkRow[pk]; });
                    data.onData = onData;
    
                    result.push(data);
                }
            });

            return result;
        }
    },
    $compare : {
        enumerable: false,
        value: function(targets, pk) {
            let pks = Array.isArray(pk) ? pk : [pk];

            let result = {
                inserts : [],
                updates : [],
                deletes : []
            };

            for (let i=0; i<targets.length; i++) {
                let row = targets[i];

                let samePkOrigin = this.find(m => pks.every(pk => m[pk] === row[pk]));
                if (samePkOrigin) {
                    let onData = {};

                    for (let k in row) {
                        if (pk.indexOf(k) > -1)
                            continue;

                        if (!(k in samePkOrigin))
                            continue;

                        if (row[k] === samePkOrigin[k])
                            continue;

                        onData[k] = row[k];
                    }

                    if (!onData.$isEmpty()) {
                        let data = {};
                        pks.forEach(pk => { data[pk] = row[pk]; });
                        data.onData = onData;

                        result.updates.push(data);
                    }

                    continue;
                }

                result.inserts.push(row);
            }

            for (let i=0; i<this.length; i++) {
                let row = this[i];
                let samePkUpdate = targets.find(m => pks.every(pk => m[pk] === row[pk]));
                if (samePkUpdate)
                    continue;

                result.deletes.push(row);
            }

            return result;
        }
    }
});

module.exports = true;