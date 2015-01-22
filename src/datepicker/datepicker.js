/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-datepicker', {
    template :
        '<div class="vue-datepicker">' +
            '<div class="vue-datepicker-inner">' +
                '<div class="vue-datepicker-head">' +
                    '<div class="vue-datepicker-label">选择日期</div>' +
                '</div>' +
                '<div class="vue-datepicker-body">' +
                    '<div class="vue-datepicker-ctrl">' +
                        '<i class="vue-datepicker-preMonthBtn"><</i>' +
                        '<i class="vue-datepicker-nextMonthBtn">></i>' +
                        '<p>2014-12-12</p>' +
                    '</div>' +
                    '<div class="vue-datepicker-weekRange">' +
                        '<span v-repeat="w:weekRange">{{w}}</span>' +
                    '</div>' +
                    '<div class="vue-datepicker-dateRange">' +
                        '<span v-repeat="d:dateRange" v-class="d.sclass" v-on="click:itemClick(d.date)">{{d.text}}</span>' +
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
            currYear : today.getFullYear(), //当前年
            currMonth : today.getMonth(), //当前月
            currDate : today.getDate() //当前日
        }
    },
    watch : {},
    methods : {
        itemClick : function (date){
            console.log(this.stringify(date))
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
            return isNaN(date.getFullYear()) ? new Date : date
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
            //本月第一天
            var currMonthFirstDay = new Date(this.currYear, this.currMonth, 1)
            //本月第一天是周几？
            var firstDayWeek = currMonthFirstDay.getDay()
            //本月总天数
            var dayCount = this.getDayCount(this.currYear, this.currMonth)

            //如果需要补足上月
            if (firstDayWeek > 1){
                var preMonthYear = this.currYear
                var preMonth = this.currMonth - 1

                if (preMonth < 0){
                    preMonth = 11
                    preMonthYear--
                }

                //上月总天数
                var prevMonthDayCount = this.getDayCount(preMonthYear, preMonth)
                for (var i=2; i<=firstDayWeek; i++){
                    var dayText = prevMonthDayCount - firstDayWeek + i
                    this.dateRange.push({
                        text : dayText,
                        date : new Date(preMonthYear, preMonth, dayText),
                        sclass : 'vue-datepicker-item-gray'
                    })
                }
            }

            //本月
            for (var i=1; i<=dayCount; i++){
                var date = new Date(this.currYear, this.currMonth, i)
                var week = date.getDay()
                this.dateRange.push({
                    text : i,
                    date : date,
                    sclass : ( week==6 || week==0 ) ? 'vue-datepicker-item-red' : ''
                })
            }

            //如果需要补足下个月
            if (this.dateRange.length < 42){
                //需要补足的天数
                var nextMonthNeed = 42 - this.dateRange.length
                var nextMonthYear = this.currYear
                var nextMonth = this.currMonth + 1
                if (nextMonth > 11){
                    nextMonth = 0
                    nextMonthYear++
                }
                for (var i=1; i<=nextMonthNeed; i++){
                    this.dateRange.push({
                        text : i,
                        date : new Date(nextMonthYear, nextMonth, i),
                        sclass : 'vue-datepicker-item-gray'
                    })
                }
            }
        }
    },
    compiled : function (){
        this.getDateRange()
    }
})