/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-datepicker', {
    template :
        '<div class="vue-datepicker">' +
            '<input class="form-control vue-datepicker-input" type="text" v-on="click:inputClick" v-model="value"/>' +
            '<div class="vue-datepicker-popup" v-style="display:popupDisplay">' +
                '<div class="vue-datepicker-inner">' +
                    '<div class="vue-datepicker-head">' +
                        '<div class="vue-datepicker-label">选择日期</div>' +
                    '</div>' +
                    '<div class="vue-datepicker-body">' +
                        '<div class="vue-datepicker-ctrl">' +
                            '<i class="glyphicon glyphicon-chevron-left vue-datepicker-preMonthBtn" v-on="click:preNextMonthClick(0)"></i>' +
                            '<i class="glyphicon glyphicon-chevron-right vue-datepicker-nextMonthBtn" v-on="click:preNextMonthClick(1)"></i>' +
                            '<p>{{stringify(currDate, "yyyy年MM月")}}</p>' +
                        '</div>' +
                        '<div class="vue-datepicker-weekRange">' +
                            '<span v-repeat="w:weekRange">{{w}}</span>' +
                        '</div>' +
                        '<div class="vue-datepicker-dateRange">' +
                            '<span v-repeat="d:dateRange" v-class="d.sclass" v-on="click:itemClick(d.date)">{{d.text}}</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    ,
    data : function (){
        var today = new Date
        return {
            config : {},
            value : '',
            weekRange : ['一', '二', '三', '四', '五', '六', '日'],
            dateRange : [], //需要绘制的日期区间
            currDate : new Date, //当前日期
            popupDisplay : 'none'
        }
    },
    watch : {
        currDate : function (){
            this.getDateRange()
        },
        value : function (){
            var valueDate = this.parse(this.value)
            if (valueDate){
                this.currDate = valueDate
            }
        }
    },
    methods : {
        inputClick : function (e){
            this.popupDisplay = this.popupDisplay=='none' ? 'block' : 'none'
        },
        preNextMonthClick : function (flag){
            var year = this.currDate.getFullYear()
            var month = this.currDate.getMonth()
            var date = this.currDate.getDate()

            if (flag == 0){
                var preMonth = this.getYearMonth(year, month-1)
                this.currDate = new Date(preMonth.year, preMonth.month, date)
            }
            else {
                var nextMonth = this.getYearMonth(year, month+1)
                this.currDate = new Date(nextMonth.year, nextMonth.month, date)
            }
        },
        itemClick : function (date){
            this.currDate = date
            this.value = this.stringify(this.currDate)
            this.popupDisplay = 'none'
        },
        getYearMonth : function (year, month){
            if (month > 11){
                year++
                month = 0
            }
            else if (month < 0){
                year--
                month = 11
            }
            return {year:year, month:month}
        },
        stringify : function (date, format){
            format = format || 'yyyy-MM-dd'

            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()

            return format
                .replace(/yyyy/g, year)
                .replace(/MM/g, ('0'+month).slice(-2))
                .replace(/dd/g, ('0'+day).slice(-2))
                .replace(/yy/g, year)
                .replace(/M/g, month)
                .replace(/d/g, day)
        },
        parse : function (str){
            var date = new Date(str)
            return isNaN(date.getFullYear()) ? null : date
        },
        getDayCount : function (year, month){ //得到每月总天数
            var dict = [31,28,31,30,31,30,31,31,30,31,30,31]

            //如果2月
            if (month == 1){
                //如果瑞年
                if ( (year%400==0) || (year%4==0 && year%100!=0) ){
                    return 29
                }
                return 28
            }

            return dict[month]
        },
        getDateRange : function (){
            this.dateRange = []

            var time = {
                year : this.currDate.getFullYear(),
                month : this.currDate.getMonth(),
                day : this.currDate.getDate()
            }
            //本月第一天
            var currMonthFirstDay = new Date(time.year, time.month, 1)
            //本月第一天是周几？
            var firstDayWeek = currMonthFirstDay.getDay()
            if (firstDayWeek == 0){
                firstDayWeek = 7
            }
            //本月总天数
            var dayCount = this.getDayCount(time.year, time.month)

            //如果需要补足上月
            if (firstDayWeek > 1){
                var preMonth = this.getYearMonth(time.year, time.month-1)

                //上月总天数
                var prevMonthDayCount = this.getDayCount(preMonth.year, preMonth.month)
                for (var i=1; i<firstDayWeek; i++){
                    var dayText = prevMonthDayCount - firstDayWeek + i + 1
                    this.dateRange.push({
                        text : dayText,
                        date : new Date(preMonth.year, preMonth.month, dayText),
                        sclass : 'vue-datepicker-item-gray'
                    })
                }
            }

            //本月
            for (var i=1; i<=dayCount; i++){
                var date = new Date(time.year, time.month, i)
                var week = date.getDay()
                var sclass = ''
                if (week==6 || week==0){
                    sclass = 'vue-datepicker-item-red'
                }
                //如果日子和当前相等
                if (i==time.day){
                    //如果value有值
                    if (this.value){
                        var valueDate = this.parse(this.value)
                        //如果value是有效的日期
                        if (valueDate){
                            //如果value的年和月和当前相等
                            if (valueDate.getFullYear() == time.year && valueDate.getMonth() == time.month){
                                sclass = 'vue-datepicker-dateRange-item-hover'
                            }
                        }
                    }
                }
                this.dateRange.push({
                    text : i,
                    date : date,
                    sclass : sclass
                })
            }

            //如果需要补足下个月
            if (this.dateRange.length < 42){
                //需要补足的天数
                var nextMonthNeed = 42 - this.dateRange.length
                var nextMonth = this.getYearMonth(time.year, time.month+1)

                for (var i=1; i<=nextMonthNeed; i++){
                    this.dateRange.push({
                        text : i,
                        date : new Date(nextMonth.year, nextMonth.month, i),
                        sclass : 'vue-datepicker-item-gray'
                    })
                }
            }
        }
    },
    compiled : function (){
        var me = this
        me.getDateRange()

        VueUI.winClick(me.$el, function (){
            me.popupDisplay = 'none'
        })
    }
})