Object.defineProperties(Date.prototype, {
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
    $getDateFormat : {
        enumerable: false,
        value: function(glue) {
            glue = (typeof glue !== 'undefined') ? glue : '';
            return this.getFullYear().$padStart(4,0) + glue + (this.getMonth()+1).$padStart(2,0) + glue + this.getDate().$padStart(2,0);
        }
    },
    $getTimeFormat : {
        enumerable: false,
        value: function(glue) {
            glue = (typeof glue !== 'undefined') ? glue : '';
            return this.getHours().$padStart(2,0) + glue + this.getMinutes().$padStart(2,0) + glue + this.getSeconds().$padStart(2,0);
        }
    },
    $setDay : {
        enumerable: false,
        value: function (day) {
            this.setDate(this.getDate() - this.getDay() + day);
        }
    },
    $getWeekStartDate : {
        enumerable: false,
        value: function (stdDay, stdHours, stdMins, stdSecs) {
            stdDay = !isNaN(stdDay) ? Number(stdDay) : 0;
            stdHours = !isNaN(stdHours) ? Number(stdHours) : 0;
            stdMins = !isNaN(stdMins) ? Number(stdMins) : 0;
            stdSecs = !isNaN(stdSecs) ? Number(stdSecs) : 0;
            let currDay = this.getDay();
            let currHours = this.getHours();
            let currMins = this.getMinutes();
            let currSecs = this.getSeconds();

            if (stdDay === currDay && stdHours === currHours && stdMins === currMins && stdSecs > currSecs)
                stdDay -= 7;
            else if (stdDay === currDay && stdHours === currHours && stdMins > currMins)
                stdDay -= 7;
            else if (stdDay === currDay && stdHours > currHours)
                stdDay -= 7;
            else if (stdDay > currDay)
                stdDay -= 7;

            let date = new Date(this.getTime());
            date.$initTime();
            date.$setDay(stdDay);
            date.setHours(stdHours);
            date.setMinutes(stdMins);
            date.setSeconds(stdSecs);
            return date;
        }
    },
    $getWeekEndDate : {
        enumerable: false,
        value: function (stdDay, stdHours, stdMins, stdSecs) {
            let date = this.$getWeekStartDate(stdDay, stdHours, stdMins, stdSecs);
            date.setDate(date.getDate() + 7);
            date.setSeconds(-1);
            return date;
        }
    },
    $prevMonth : {
        enumerable: false,
        value: function () {
            let day = this.getDate();
            this.setDate(0);
            this.setDate(day);
        }
    },
    $nextMonth : {
        enumerable: false,
        value: function () {
            this.setMonth(this.getMonth() + 1);
        }
    },
    $isChanged : {
        enumerable: false,
        value: function (src, format) {
            let isChanged = false;
            switch(format){
                case Date.$YEAR :
                    isChanged = this.getFullYear() - src.getFullYear() != 0;
                    break;
                case Date.$MONTH : 
                    isChanged = this.getFullYear() - src.getFullYear() != 0;
                    isChanged = !isChanged ? this.getMonth() - src.getMonth() != 0 : true;                    
                    break;
                case Date.$DAY : 
                    isChanged = this.getFullYear() - src.getFullYear() != 0;
                    isChanged = !isChanged ? this.getMonth() - src.getMonth() != 0 : true;
                    isChanged = !isChanged ? this.getDate() - src.getDate() != 0 : true;
                    break;
            }

            return isChanged;
        }
    },
    $nextDate : {
        enumerable: false,
        value: function () {
            this.setDate(this.getDate() + 1);
        }
    },
    $initTime : {
        enumerable: false,
        value: function () {
            this.setHours(0);
            this.setMinutes(0);
            this.setSeconds(0);
            this.setMilliseconds(0);
            return this;
        }
    },
    $toTimestamp : {
        enumerable: false,
        value: function () {
            return Math.floor(this.getTime() / 1000);
        }
    }
});

Object.defineProperties(Date, {
    $YEAR : {
        enumerable: false,
        value: 2
    },
    $MONTH : {
        enumerable: false,
        value: 1
    },
    $DAY : {
        enumerable: false,
        value: 0
    },
    $nowSecs : {
        enumerable: false,
        value: function () {
            return Math.floor(this.now() / 1000);
        }
    },
    /*getTsByFormat : {
        enumerable: false,
        value: function (format) {
            return Math.floor(this.now() / 1000);
        }
    }*/
});

module.exports = true;