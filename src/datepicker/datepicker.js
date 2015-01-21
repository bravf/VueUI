/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-datepicker', {
    template :
        '<div>' +
            '<span v-repeat="d:dateRange">{{d.text}}</span>' +
        '</div>'
    ,
    data : function (){
        var today = new Date
        return {
            config : {},
            value : '',
            dateRange : [], //需要绘制的日期区间
            currYear : today.getFullYear(), //当前年
            currMonth : today.getMonth(), //当前月
            currDate : today.getDate() //当前日
        }
    },
    watch : {},
    methods : {
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
            if (month < 0){
                year--
                month = 0
            }
            else if (month > 11){
                year++
                month = 0
            }

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
            if (firstDayWeek < 7){
                //上月总天数
                var prevMonthDayCount = this.getDayCount(this.currYear, this.currMonth-1)
                for (var i=0; i<firstDayWeek; i++){
                    this.dateRange.push({
                        text : prevMonthDayCount-firstDayWeek + i + 1
                    })
                }
            }

            //本月
            for (var i=1; i<=dayCount; i++){
                this.dateRange.push({
                    text : i
                })
            }
        }
    },
    compiled : function (){
        this.getDateRange()
    }
})