Object.defineProperties(Number.prototype, {
    $padStart : {
        enumerable: false,
        value: function (length, pad) {
            return this.toString().padStart(length, pad);
        }
    },
    $getDecimalLength : {
        enumerable: false,
        value: function () {
            let spl = String(this).split('.');
            if (spl.length === 1)
                return 0;

            return spl[1].length;;
        }
    },
    $range : {
        enumerable: false,
        value: function (start, end) {
            if (isNaN(start) || isNaN(end))
                return false;

            if (start > this)
                return false;

            if (end < this)
                return false;

            return true;
        }
    },
    $pad : {
        enumerable: false,
        value: function (length, value) {
            let n = String(this);
            value = value || '0';
            return n.length >= length ? n : new Array(length - n.length + 1).join(value) + n;
        }
    }
});

module.exports = true;