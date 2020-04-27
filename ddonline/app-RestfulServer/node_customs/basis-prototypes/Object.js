Object.defineProperties(Object.prototype, {
    $isEmpty : {
        enumerable: false,
        value: function () { return (Object.getOwnPropertyNames(this).length === 0); }
    },
    $length : {
        enumerable: false,
        value: function () { return Object.keys(this).length; }
    },
    $from : {
        enumerable: false,
        value: function (dict) {
            if (typeof dict !== 'object')
                return this;

            for (let key in dict) {
                if (!(key in this))
                    continue;

                this[key] = dict[key];
            }

            return this;
        }
    },
    $existsKey : {
        enumerable: false,
        value: function (...keys) { return keys.every(v => v in this); }
    },
    $exists : {
        enumerable: false,
        value: function (...values) {
            let target = Object.values(this);
            return values.every(v => target.indexOf(v) > -1);
            /*for (let i=0; i<values.length; i++) {
                if (target.indexOf(values[i]) > -1)
                    continue;

                return false;
            }

            return true;*/
        }
    },
    $in : {
        enumerable: false,
        value: function (obj) {
            for (let key in obj) {
                if (!(key in this))
                    return false;

                if (this[key] !== obj[key])
                    return false;
            }

            return true;
        }
    },
    $copy : {
        enumerable: false,
        value: function () {
            let result = {};
            for (var key in this) {
                if (!this.hasOwnProperty(key))
                    continue;

                if (Object.$isPure(this[key])) {
                    result[key] = this[key].$copy();
                    continue;
                }

                if (Array.isArray(this[key])) {
                    result[key] = this[key].slice();
                    continue;
                }

                result[key] = this[key];
            }

            return result;
        }
    },
    $isDiff : {
        enumerable: false,
        value: function (target) {
            let procKeys = [];
            for (let key in this) {
                procKeys.push(key);

                if (key in target && Object.$isSame(this[key], target[key]))
                    continue;

                return true;
            }

            for (let key in target) {
                if (procKeys.indexOf(key) === -1)
                    return true;
            }

            return false;
        }
    },
    $diff : {
        enumerable: false,
        value: function (target) {
            let procKeys = [];
            let result = {};
            for (let key in this) {
                procKeys.push(key);

                if (key in target && Object.$isSame(this[key], target[key]))
                    continue;

                result[key] = this[key];
            }

            for (let key in target) {
                if (procKeys.indexOf(key) > -1)
                    continue;

                result[key] = null;
            }

            return Object.keys(result).length > 0 ? result : null;
        }
    },
    $assertCheckColumn : {
        enumerable: false,
        value: function (m) {
            if (m.$existsKey(...Object.keys(this)))
                return;
    
            throw new Error('Column Does Not Match');
        }
    },
    $getInsertedDictFrom : {
        enumerable: false,
        value: function(originDict) {
            let result = {};
            for (let pk in this) {
                if (this[pk] === null)
                    continue;

                if (pk in originDict && originDict[pk] !== null)
                    continue;

                result[pk] = this[pk];
            }
            return result;
        }
    },
    $getModifiedDictFrom : {
        enumerable: false,
        value: function(originDict, isReturnUpdatedOnly) {
            let opt = {
                isReturnUpdatedOnly : Boolean(isReturnUpdatedOnly)
            };
            let result = {};

            for (let pk in originDict) {
                if (!(pk in this))
                    continue;

                if (this[pk] === null || originDict[pk] === null)
                    continue;

                if (opt.isReturnUpdatedOnly) {
                    let r = this[pk].$diff(originDict[pk]);
                    if (r.$isEmpty())
                        continue;

                    result[pk] = r;
                } else {
                    if (Object.$isSame(this[pk], originDict[pk]))
                        continue;

                    result[pk] = this[pk];
                }
            }

            return result;
        }
    },
});

Object.defineProperties(Object, {
    $createByTwoArray : {
        enumerable: false,
        value: (keys, values) => {
            let result = {};
            for (let i=0; i<keys.length; i++)
                result[keys[i]] = values[i];

            return result;
        }
    },
    $isPure : {
        enumerable: false,
        value: (obj) => {
            if (obj === null)
                return false;

            if (typeof obj !== 'object')
                return false;

            if (Array.isArray(obj))
                return false;

            return true;
        }
    },
    $isSame : {
        enumerable: false,
        value: function (obj1, obj2) {
            let type = typeof obj1;
            if (type !== typeof obj2)
                return false;

            if (type !== 'object')
                return (obj1 === obj2);

            if (obj1 === null || obj2 === null)
                return (obj1 === obj2);

            if (Object.keys(obj1).length !== Object.keys(obj2).length)
                return false;

            for (let key in obj1) {
                if (!(key in obj2))
                    return false;

                if (!Object.$isSame(obj1[key], obj2[key]))
                    return false;
            }

            return true;
        }
    },
});

module.exports = true;