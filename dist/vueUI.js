/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

window.VueUI = function (){
    var VueUI = {}

    var componentPool = {}
    var comCounter = 1

    function getComId(){
        return (new Date).getTime() + '_' + comCounter
    }

    //将外部传进来的参数mix到data
    function mixConfig(){
        for (var key in this.config){
            this[key] = this.config[key]
        }
    }

    //监控外部参数的变化同步到data
    function syncConfig(){
        var me = this
        me.$watch('config', function (){
            mixConfig.call(me)
        }, true)
    }

    //处理vue-attr
    function handleVueAttr(){
        var me = this

        ;[].slice.call(me.$el.attributes).forEach(function (item){
            var key = item.name
            var value = item.value

            if (key.indexOf('vue-attr-') == 0){
                me[key.slice(9)] = value 
            }
        })
    }

    //处理vue-model
    function handleVueModel(){
        var me = this

        ;[{a:'vue-model', b:'value'}, {a:'vue-model-text', b:'text'}].forEach(function (item){
            var a = item.a
            var b = item.b

            var attr = me.$el.getAttribute(a)
            if (!attr){
                return
            }

            var parentObj = me.$parent
            var parentAttr = attr

            var attrList = attr.split('.')

            if (attrList.length > 1){
                attrList.slice(0, -1).forEach(function (k){
                    parentObj = parentObj[k]
                })
                parentAttr = attrList.slice(-1)[0]
            }

            //只有vue-model是双向（多重双向会导致数据混乱）
            if (a == 'vue-model'){
                me[b] = parentObj[parentAttr]
                me.$parent.$watch(attr, function (){
                    me[b] = parentObj[parentAttr]
                })
            }

            me.$watch(b, function (){
                parentObj[parentAttr] = me[b]
            })
        })
    }

    VueUI.component = function (key, options){
        //在created方法中做一些全局管理操作
        var _compiled = options['compiled'] || VueUI.emptyFunc

        options['compiled'] = function (){
            //设置id，并保存到pool
            var comId = this.$el.getAttribute('vue-id') || getComId()
            componentPool[comId] = this

            handleVueAttr.call(this)
            handleVueModel.call(this)
            mixConfig.call(this)
            syncConfig.call(this)

            _compiled.call(this)
        }
        //调用系统的方式
        Vue.component(key, options)
    }

    VueUI.getComponent = VueUI.$ = function (id){
        return componentPool[id]
    }

    VueUI.getComId = getComId
    VueUI.emptyFunc = Function.prototype

    VueUI.resetArray = function (a, b){
        while (a.length){
            a.pop()
        }
        b.forEach(function (x){
            a.push(x)
        })
    }

    VueUI.winClick = function (targetDom, callback){
        $(window).on('click', function (e){
            var dom = e.target

            while (dom){
                if (dom == targetDom){
                    return
                }
                dom = dom.parentElement
                if (dom == document.body){
                    break
                }
            }

            callback()
        })
    }

    return VueUI

}()
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
                            '<i class="vue-month-btn vue-datepicker-preMonthBtn" v-on="click:preNextMonthClick(0)">&lt;</i>' +
                            '<i class="vue-month-btn vue-datepicker-nextMonthBtn" v-on="click:preNextMonthClick(1)">&gt;</i>' +
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
/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-modal', {
    template :
        '<div class="modal vue-modal" v-show="toggle">' +
            '<div class="modal-backdrop fade in vue-modal-backdrop"></div>' +
            '<div class="modal-dialog" v-style="width:width+\'px\'">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" v-on="click:toggle=false"><span aria-hidden="true">×</span></button>' +
                        '<h4 class="modal-title">{{title}}</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '{{{content}}}' +
                        '<content></content>' +
                    '</div>' +
                    '<div class="modal-footer" v-show="isShowCancelBtn || isShowOkBtn">' +
                        '<button type="button" class="btn btn-default" v-on="click:cancelBtnClick" v-show="isShowCancelBtn">{{cancelBtnText}}</button>' +
                        '<button type="button" class="btn btn-primary" v-on="click:okBtnClick" v-show="isShowOkBtn">{{okBtnText}}</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    ,
    data : function (){
        return {
            config : {},

            title : '', //标题
            content : '', //内容
            toggle : false, //是否显示
            width : 500, //宽度

            // 按钮相关
            isShowCancelBtn : false,
            cancelBtnText : '取消',
            cancelBtnCallback : VueUI.emptyFunc,

            isShowOkBtn : false,
            okBtnText : '确认',
            okBtnCallback : VueUI.emptyFunc,
        }
    },
    watch : {
        content : function (){
            this.$compile(this.$el.querySelector('.modal-body'))
        },
        title : function (){
            this.title = this.title || document.title
        },
        toggle : function (){
            if (this.toggle){
                this.syncHeight()
            }

            document.body.style.overflow = this.toggle ? 'hidden' : 'auto'
        }
    },
    methods : {
        cancelBtnClick : function (){
            this.toggle = false
            this.cancelBtnCallback()
        },
        okBtnClick : function (){
            this.toggle = false
            this.okBtnCallback()
        },
        syncHeight : function (){
            var height = Math.max(this.$$el.find('.modal-dialog').height() + 60, document.documentElement.clientHeight)
            this.$backdrop.height(height)
        },
        show : function (){
            this.toggle = true
        },
        hide : function (){
            this.toggle = false
        }
    },
    compiled : function (){
        this.title = this.title || document.title

        this.$$el = $(this.$el)
        this.$backdrop = this.$$el.find('.vue-modal-backdrop')
    }
})

new function (){
    var str =
    '<div id="VueUIAlertConfirm">' +
        '<vue-modal vue-id="VueUIAlert" v-with="config:VueUIAlertConf"></vue-modal>' +
        '<vue-modal vue-id="VueUIConfirm" v-with="config:VueUIConfirmConf"></vue-modal>' +
    '</div>'
    $('body').append(str)

    new Vue({
        el : '#VueUIAlertConfirm',
        data : {
            VueUIAlertConf : {
                isShowOkBtn : true
            },
            VueUIConfirmConf : {
                isShowOkBtn : true,
                isShowCancelBtn : true
            }
        }
    })

    var alertVU = VueUI.getComponent('VueUIAlert')
    var confirmVU = VueUI.getComponent('VueUIConfirm')

    VueUI.alert = function (conf){
        if ($.type(conf) == 'object'){
            alertVU.title = conf.title
            alertVU.content = conf.content || ''
            alertVU.okBtnCallback = conf.okCallback || VueUI.emptyFunc
        }
        else {
            alertVU.content = conf
            alertVU.title = document.title
            alertVU.okBtnCallback = VueUI.emptyFunc
        }
        alertVU.toggle = true
    }

    VueUI.confirm = function (conf){
        confirmVU.title = conf.title
        confirmVU.content = conf.content || '',
        confirmVU.okBtnCallback = conf.okCallback || VueUI.emptyFunc
        confirmVU.cancelBtnCallback = conf.cancelCallback || VueUI.emptyFunc
        confirmVU.toggle = true
    }
}()
/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-pager', {
    template :
    '<div class="vue-pager">' +
        '<ul class="pagination pagination-sm vue-pager-pagination">' +
            '<li v-repeat="pageRange" v-on="click:pageClick(num)" v-class="className">' +
                '<a href="javascript:;">{{text}}</a>' +
            '</li>' +
        '</ul>' +
    '</div>',
    data : function (){
        return {
            pageRange : [],
            totalPage : 0,
            currPage : 1,
            prevShow : 3,
            nextShow : 3,
            onChange : VueUI.emptyFunc,
            config : {}
        }
    },
    watch : {
        totalPage : function (){
            this.getPageRange()
        },
        currPage : function (){
            this.getPageRange()
            this.onChange(this.currPage)
        },
        prevShow : function (){
            this.getPageRange()
        },
        nextShow : function (){
            this.getPageRange()
        }
    },
    methods : {
        getPageRange : function (){
            var start = 0
            var end = 0
            var showLen = this.prevShow + this.nextShow + 1
            var totalPage = Math.max(this.totalPage, 1)
            var currPage = this.currPage

            if (totalPage <= 1){
                start = end = 1
            }
            else if (totalPage <= showLen){
                start = 1
                end = totalPage
            }
            else {
                if (currPage <= this.prevShow + 1){
                    start = 1
                    end = showLen
                }
                else if (currPage >= totalPage - this.nextShow){
                    end = totalPage
                    start = totalPage - showLen + 1
                }
                else {
                    start = currPage - this.prevShow
                    end = currPage + this.nextShow
                }
            }

            this.pageRange = []

            //上一页
            if (currPage != 1){
                this.pageRange.push({num:currPage-1, text:'«'})
            }
            //第一页
            if (start >= 2){
                this.pageRange.push({num:1, text:1})
            }
            //省略好
            if (start > 2){
                this.pageRange.push({text:'..'})
            }
            //显示的页码列表
            for (var i=start; i<=end; i++){
                this.pageRange.push({
                    num : i,
                    text : i,
                    className : (i==currPage) ? 'active' : ''
                })
            }
            //省略号
            if (end < totalPage-1){
                this.pageRange.push({text:'..'})
            }
            //最后一页
            if (end <= totalPage-1){
                this.pageRange.push({num:totalPage, text:totalPage})
            }
            //下一页
            if (currPage != totalPage){
                this.pageRange.push({num:currPage+1, text:'»'})
            }
        },
        pageClick : function (i){
            if (!i){
                return false
            }
            if (i == this.currPage){
                return false
            }

            this.currPage = i
            this.getPageRange()
        }
    },
    compiled : function (){
        this.getPageRange()
    }
})
/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-select', {
    template :
        '<div class="vue-select">' +
            '<div class="vue-select-content"><content></content></div>' +
            '<button type="button" class="btn btn-default vue-select-btn" v-on="click:buttonClick">' +
                '<span class="vue-select-btn-text">{{text}}</span>' +
                '<span class="caret"></span>' +
            '</button>' +
            '<div class="vue-select-options-div" v-show="display">' +
                '<ul class="dropdown-menu vue-select-options-ul">' +
                    '<li v-repeat="data" v-on="click:itemClick($index)" v-class="vue-select-option-curr:$index==index">' +
                        '<a href="javascript:;">{{text}}</a>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
        '</div>'
    ,
    data : function (){
        return {
            config : {},
            //数据
            data : [],
            //组件宽度
            width: 100,
            //是否显示options
            display : false,
            //当前值
            value : '',
            //当前文本
            text : '',
            //当前索引
            index : 0,
            onChange : VueUI.emptyFunc
        }
    },
    watch : {
        data : function (){
            this.syncCurr('data')
        },
        value : function (){
            this.syncCurr('value')
        },
        index : function (){
            this.syncCurrByIndex()
            this.onChange(this.value, this.text, this.index)
        }
    },
    methods : {
        buttonClick : function (){
            this.toggleOptions()
        },
        itemClick : function (idx){
            this.index = idx
            this.toggleOptions()
        },
        syncCurr : function (key){
            if (this.data.length == 0){
                return
            }

            for (var i=0, option; i<this.data.length; i++){
                option = this.data[i]
                if (option['value'] == this['value']){
                    this.index = i
                    this.text = option.text
                    this.value = option.value
                    return
                }
            }

            this.syncCurrByIndex(0)
        },
        syncCurrByIndex : function (idx){
            if (typeof idx == 'undefined'){
                idx = this.index
            }

            var currOption = this.data[idx]
            if (!currOption){
                return
            }
            this.value = currOption.value
            this.text = currOption.text
        },
        toggleOptions : function (){
            this.display = !this.display

            if (!this.display){
                return
            }

            var $select = $(this.$el)
            var $div = $select.find('.vue-select-options-div')
            var $btn = $select.find('.vue-select-btn')
            var $ul = $select.find('ul')

            //设置li文本宽度
            var optionTxtWidth = this.width - 36
            $ul.find('a').width(optionTxtWidth)

            //判断option向上弹出还是向下
            //得到页面总高度
            var pageH = Math.max(
                document.documentElement.scrollHeight,
                document.documentElement.clientHeight
            )
            //得到组件y轴位置
            var selectY = $select.offset().top
            //得到容器高度
            var divH = $div.outerHeight()
            //得到btn的高度
            var btnH = $btn.outerHeight()

            var scrollTop = 0
            var marginTop = 0
            var fn = ''

            //当高于maxHeight，出现滚动条
            if (this.data.length > 10){
                $div.css('overflow-y', 'scroll')
            }
            else {
                $div.css('overflow-y', 'hidden')
            }

            if ( (divH >= (pageH-selectY)) && (selectY >= divH) ){
                marginTop = -(btnH + divH + 4)
                scrollTop = 1e8
                fn = 'addClass'
            }
            else {
                marginTop = 0
                scrollTop = 0
                fn = 'removeClass'
            }

            $div.css('margin-top', marginTop)
            $ul[fn]('vue-select-options-ul-scaleY')

            Vue.nextTick(function (){
                $div.scrollTop(scrollTop)
            })
        }
    },
    compiled : function (){
        var me = this

        this.syncCurr()

        var $dom = $(this.$el)
        var $btn = $dom.find('.vue-select-btn')

        //检查是否有硬编码的option
        var $options = $dom.find('option')
        if ($options.length > 0){
            this.data = []

            $options.each(function (){
                me.data.push({
                    value : this.value,
                    text : this.text
                })
            })
        }

        //设置各种宽度
        $dom.find('.vue-select').outerWidth(this.width)
        $btn.find('.vue-select-btn-text').width(this.width - 35)
        $dom.find('.vue-select-options-div').outerWidth(this.width)

        VueUI.winClick(me.$el, function (){
            me.display = false
        })
    }
})
/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-suggest', {
    template :
        '<div class="vue-suggest">' +
            '<input class="form-control" v-model="text" v-on="keydown:keydown, focus:focus, blur:blur"/>' +
            '<div class="vue-suggest-options-div" v-show="display">' +
                '<ul class="dropdown-menu vue-suggest-options-ul">' +
                    '<li v-repeat="data" v-on="click:itemClick($index)" v-class="vue-suggest-option-curr:$index==index">' +
                        '<a href="javascript:;" title="{{text}}">{{text}}</a>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
        '</div>'
    ,
    data : function (){
        return {
            config : {},
            display : false,

            width : 300,
            data : [],
            valid : false,                 //是否校验是有效值

            value : '',
            text : '',
            index : -1,
            isBlock : false,               //标记是否对text的change发请求
            isBlur : true,

            url : '',                      //请求地址
            field : 'words',               //请求字段名

            filterData : function (data){   //处理返回数据
                return data
            }
        }
    },
    watch : {
        text : function (){
            if (this.isBlock || this.isBlur){
                return false
            }
            this.value = ''
            this.delayRequest()
        },
        display : function (val){
            if (!val){
                if (this.valid && !this.value){
                    this.text = ''
                }
            }
        }
    },
    methods : {
        keydown : function (e){
            var me = this
            switch (e.keyCode){
                case 13:
                    me.display = false
                    break

                case 38:
                    e.preventDefault()
                    me.setIndex(me.index--)
                    break

                case 40:
                    e.preventDefault()
                    me.setIndex(me.index++)
                    break

                default:
                    break
            }
        },
        focus : function (){
            this.isBlur = false
            if (this.text){
                this.delayRequest()
            }
        },
        blur : function (){
            this.isBlur = true
        },
        delayRequest : function (){
            var me = this
            if (me.reqTimer){
                clearTimeout(me.reqTimer)
            }
            me.reqTimer = setTimeout(function (){
                me.sendRequest()
            }, 150);
        },
        sendRequest : function (){
            var me = this
            var params = {}

            if (!me.text){
                return false
            }

            params[this.field] = this.text
            params['-'] = (new Date).getTime()

            $.getJSON(this.url, params).done(function (data){
                me.data = me.filterData(data)
                me.index = -1
                if (me.data.length){
                    me.display = true
                }
            })
        },
        setIndex : function (){
            var me = this

            if (!me.display){
                return false
            }

            //暂时关闭对text的监控，此时发生的text变化不发起请求
            me.isBlock = true
            setTimeout(function (){
                me.isBlock = false
            }, 50)
            
            if (!this.data.length) {
                return
            }

            var min = 0
            var max = this.data.length - 1

            if (this.index < min){
                this.index = max
            }
            if (this.index > max){
                this.index = min
            }

            this.value = this.data[this.index].value
            this.text = this.data[this.index].text
        },
        itemClick : function (idx){
            this.index = idx
            this.setIndex()
            this.display = false
        }
    },
    compiled : function (){
        var me = this
        me.$$el = $(me.$el)
        me.$input = me.$$el.find('.form-control')

        //设置宽度
        me.$$el.find('.vue-suggest').outerWidth(me.width)
        me.$$el.find('.vue-suggest-options-div').outerWidth(me.width)

        //设置全局事件
        VueUI.winClick(me.$el, function (){
            me.display = false
        })
    }
})
/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-tab', {
    template : '<div class="vue-tab"><content></content></div>',
    data : function (){
        return {
            config : {},
            active : 0
        }
    },
    watch : {
        active : function (){
            this.setActive()
        }
    },
    methods : {
        setActive : function (){
            this.$tabs.removeClass('active').eq(this.active).addClass('active')
            this.$contents.removeClass('active').eq(this.active).addClass('active')
        }
    },
    compiled : function (){
        var me = this
        this.$$el = $(this.$el)
        this.$tabs = this.$$el.find('.nav li')
        this.$contents = this.$$el.find('.tab-pane')

        this.$tabs.each(function (idx){
            $(this).on('click', function (){
                me.active = idx
            })
        })

        this.setActive()
    }
})
/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-table', {
    template :
        '<table class="table table-bordered table-hover vue-table">' +
            '<thead v-if="isShowHead"><tr>' +
                '<th v-if="isCheckable" class="vue-table-cb-td">' +
                    '<input type="checkbox" v-on="change:masterCbChange" class="vue-table-master-cb"/>' +
                '</th>' +
                '<th v-repeat="c:columns" v-style="width:c.width, text-align:c.textAlign" class="vue-table-th">' +
                    '{{c.text}}' +
                    '<span v-if="c.isSortable" class="glyphicon glyphicon-arrow-up vue-table-glyphicon-disabled" v-on="click:sortClick($index)"></span>' +
                '</th>' +
            '</tr></thead>' +
            '<tbody>' +
                '<tr v-show="!data.length"><td colspan="{{columnsLen}}" class="vue-table-empty">没有任何数据</td></tr>' +
                '<tr v-show="data.length" v-repeat="d:data">' +
                    '<td v-if="isCheckable" class="vue-table-cb-td"><input type="checkbox" v-on="change:cbChange" class="vue-table-cb"/></td>' +
                    '<td v-repeat="c:columns" v-style="text-align:c.textAlign2">{{{d[c["field"]]}}}</td>' +
                '</tr>' +
            '</tbody>' +
            '<tfoot v-if="isShowFoot"><tr><td colspan="{{columnsLen}}" class="vue-table-pager-td">' +
                '<p class="vue-table-totalCount">共 {{totalCount}} 条结果</p>' +
                '<div class="vue-table-pager"><vue-pager v-ref="pager" v-with="config:pagerConfig" vue-id="{{vuePageId}}"></vue-pager></div>' +
            '</td></tr></tfoot>' +
        '</table>'
    ,
    data : function (){
        return {
            config : {},
            data : [], //数据
            totalCount : 0, // 数据总量
            columns : [], //列
            columnsLen : 0, //总列数
            isShowHead : true, //是否显示表格头
            isShowFoot : true, //是否显示表格尾
            isCheckable : false, //是否可以选择数据
            sortField : '', //当前排序字段
            sortDir : 0, //0表示降序，1表示升序
            onSortChange : VueUI.emptyFunc, //当排序信息改变

            //分页相关参数
            pagerConfig : {
                totalPage : 0,
                onChange : VueUI.emptyFunc
            },
            totalPage : 0,
            onPagerChange : VueUI.emptyFunc,
            vuePageId : VueUI.getComId() + '_table_pager'
        }
    },
    watch : {
        totalPage : function (){
            this.pagerConfig.totalPage = this.totalPage
        },
        onPagerChange : function (){
            this.pagerConfig.onChange = this.onPagerChange
        },
        data : function (){
            var me = this
            this.unCheckedMaster()

            if (this.data.length > 0){
                me.compileTbody()
            }
        },
        sortField : function (){
            this.syncSort()
        },
        sortDir : function (){
            this.syncSort()
        }
    },
    methods : {
        compileTbody : function (){
            this.$compile(this.$el.getElementsByTagName('tbody')[0])
        },
        sortClick : function (idx){
            var column = this.columns[idx]
            if (!column.isSortable){
                return
            }

            this.sortField = column.field
            column.sortDir = (column.sortDir=='0') ? '1' : '0'
            this.sortDir = column.sortDir

            this.onSortChange(this.sortField, this.sortDir)
        },
        syncSort : function (){ //同步排序相关
            var me = this
            var columns = me.columns

            me.$$el.find('.vue-table-th').each(function (idx){
                var arrow = $(this).find('.glyphicon')
                if (!arrow.length){
                    return
                }
                if (me.sortField == columns[idx].field){
                    arrow.attr('class', 'glyphicon glyphicon-arrow-' + ['up', 'down'][me.sortDir])
                }
                else {
                    arrow.addClass('vue-table-glyphicon-disabled')
                }
            })

        },
        masterCbChange : function (e){
            var cbs = this.$$el.find('.vue-table-cb').prop('checked', e.target.checked)
        },
        cbChange : function (){
            var me = this
            var isAllChecked = true

            me.$$el.find('.vue-table-cb').each(function (){
                if (!this.checked){
                    isAllChecked = false
                    return false
                }
            })

            me.$$el.find('.vue-table-master-cb').prop('checked', isAllChecked)
        },
        unCheckedMaster : function (){
            if (!this.isCheckable){
                return
            }
            this.$$el.find('.vue-table-master-cb').prop('checked', false)
        },
        handleColumns : function (){
            function getDefaultConf(){
                return {
                    width : 150,
                    textAlign : 'left',
                    isSortable : false
                }
            }

            var columns = this.columns
            if (!columns.length){
                return
            }

            var me = this
            var hasAuto = false //检查是否有width=auto的列，不然就设置最后一项width=auto

            for (var i=0,c,len=columns.length; i<len; i++){
                c = columns[i]

                if ($.type(c) == 'string'){
                    c = columns[i] = {'field':c, 'text':c}
                }
                c = columns[i] = $.extend(true, getDefaultConf(), columns[i])

                if (!c.text){
                    c.text = c.field
                }

                if (!c.textAlign2){
                    c.textAlign2 = c.textAlign
                }

                if (c.width == 'auto'){
                    hasAuto = true
                }
                else {
                    c.width = c.width + 'px'
                }
            }

            if (!hasAuto){
                columns[len-1].width = 'auto'
            }
        },
        getChecked : function (){
            var me = this
            var data = []

            me.$$el.find('.vue-table-cb').each(function (idx){
                if ($(this).prop('checked')){
                    data.push(me.data[idx])
                }
            })

            return data
        }
    },
    compiled : function (){
        this.$$el = $(this.$el)
        this.pager = VueUI.$(this.vuePageId)
        this.handleColumns()

        this.columnsLen = this.columns.length
        if (this.isCheckable){
            this.columnsLen ++
        }
    }
})