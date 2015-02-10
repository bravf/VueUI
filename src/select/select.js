/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-select', {
    template :
        '<div class="vue-select">' +
            '<div class="vue-select-content"><content></content></div>' +
            '<button class="btn btn-default vue-select-btn" v-on="click:buttonClick">' +
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
            this.syncCurr()
        },
        index : function (){
            this.syncCurrByIndex()
            this.onChange(this.value, this.text, this.index)
        },
        value : function (){
            this.syncCurr()
        },
        text : function (){
            this.syncCurr('text')
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
            if (!this.data.length){
                this.value = this.text = ''
                return
            }

            key = (key=='text') ? 'text' : 'value'

            if (key == 'value'){
                if (this.value=='' && this.text!=''){
                    key = 'text'
                }
            }

            for (var i=0, option; i<this.data.length; i++){
                option = this.data[i]
                if (option[key] == this[key]){
                    this.index = i
                    this.text = option.text
                    this.value = option.value
                    return
                }
            }
            this.syncCurrByIndex()
        },
        syncCurrByIndex : function (){
            var currOption = this.data[this.index]
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

        //设置全局事件
        $(window).on('click', function (e){
            var dom = e.target

            while (dom){
                if (dom == me.$el){
                    return
                }
                dom = dom.parentElement
                if (dom == document.body){
                    break
                }
            }

            me.display = false
        })
    }
})