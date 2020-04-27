Object.defineProperties(Math, {
    $rand : {
        enumerable: false,
        value: function (min, max) {
            let value = this.random() * (max - min + 1);
            return this.floor(value) + min;
        }
    },
    $rating : {
        enumerable: false,
        value: function (rate, max) {
            if (rate === 0)
                return false;

            if (max === undefined)
                max = 100;

            let decimalLength = this.max(rate.$getDecimalLength(), max.$getDecimalLength());
            let multiply = Math.pow(10, decimalLength);

            max  *= multiply;
            rate *= multiply;

            let val = this.$rand(1, max);
            return (val <= rate);
        }
    },
    $ratingIndexOf : {
        enumerable: false,
        value: function (values) {
            let length = 0;
            let maxRate = 0;
            values.forEach(v => {
                length = Math.max(length, v.$getDecimalLength());
                maxRate += v;
            });

            if (maxRate > 0) {
                let fix = Math.pow(10, length);

                maxRate *= fix;
                let resultRate = Math.$rand(1, maxRate);

                let currentRate = 0;
                for (let i=0; i<values.length; i++) {
                    let rate = values[i] * fix;
                    currentRate += rate;
                    if (currentRate < resultRate)
                        continue;

                    return i;
                }
            }

            return -1;
        }
    }
});

module.exports = true;