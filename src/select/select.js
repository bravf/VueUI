/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-select', {
    template :
        '<div class="vue-select" v-on="click:selectClick">' +
            '<button class="btn btn-default vue-select-btn" v-on="click:buttonClick">' +
                '<span class="vue-select-btn-text">{{text}}</span>' +
                '<span class="caret"></span>' +
            '</button>' +
            '<div class="vue-select-options-div" v-style="display:display">' +
                '<ul class="dropdown-menu vue-select-options-ul">' +
                    '<li v-repeat="options" v-on="click:itemClick($index)" v-class="vue-select-option-curr:$index==index">' +
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
            options : [],
            //组件宽度
            width: 100,
            //是否显示options
            display : 'none',
            //当前值
            value : '',
            //当前文本
            text : '',
            //当前索引
            index : 0
        }
    },
    watch : {
        options : function (){
            this.syncCurrByValue()
        },
        index : function (){
            this.syncCurrByIndex()
        },
        value : function (){
            this.syncCurrByValue()
        }
    },
    methods : {
        selectClick : function (e){
            e.stopPropagation()
        },
        buttonClick : function (){
            this.toggleOptions()
        },
        itemClick : function (idx){
            this.index = idx
            this.toggleOptions()
        },
        getVal : function (){
            return {
                value : this.value,
                text : this.text,
                index : this.index
            }
        },
        syncCurrByValue : function (){
            if (!this.options.length){
                return
            }
            for (var i=0, option; i<this.options.length; i++){
                option = this.options[i]
                if (option.value == this.value){
                    this.index = i
                    this.text = option.text
                    return
                }
            }
            this.syncCurrByIndex()
        },
        syncCurrByIndex : function (){
            var currOption = this.options[this.index]
            if (!currOption){
                return
            }
            this.value = currOption.value
            this.text = currOption.text
        },
        toggleOptions : function (){
            this.display = this.display == 'none' ? 'block' : 'none'

            if (this.display == 'none'){
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
            var pageH = document.documentElement.scrollHeight
            //得到组件y轴位置
            var selectY = $select.position().top
            //得到容器高度
            var divH = $div.outerHeight()
            //得到btn的高度
            var btnH = $btn.outerHeight()

            var scrollTop = 0
            var marginTop = 0
            var fn = ''

            if (divH >= (pageH-selectY)){
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

        this.syncCurrByValue()

        var $dom = $(this.$el)
        var $btn = $dom.find('.vue-select-btn')
        var $optionsDiv = $dom.find('.vue-select-options-div')
        var $caret = $btn.find('.caret')

        $(window).on('click', function (e){
            me.display = 'none'
        })

        $btn.outerWidth(this.width)
        $optionsDiv.outerWidth(this.width)

        $btn.find('.vue-select-btn-text').width(this.width - 35)
    }
})