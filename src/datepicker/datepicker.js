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
        return {
            config : {},
            dateRange : [], //需要绘制的日期区间
            currDate : new Date, //当前日期，默认今天
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
        getDateRange : function (){
            var currDate = this.currDate
            //本月第一天
            var currMonthFirstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1)
            console.log(this.stringify(currMonthFirstDay))
        }
    },
    compiled : function (){
        this.getDateRange()
    }
})