Object.defineProperties(String.prototype, {
    $capitalize : {
        enumerable: false,
        value: function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }
    },
    $range : {
        enumerable: false,
        value: function (start, end) {
            if (start > this)
                return false;

            if (end < this)
                return false;

            return true;
        }
    },
});

module.exports = true;