/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-select', {
    template :
        '<div class="vue-select">' +
            '<button class="btn btn-default vue-select-btn" v-on="click:buttonClick">{{options[currIndex].text}}' +
                '<span class="caret"></span>' +
            '</button>' +
            '<div class="vue-select-options-div" v-style="display:display">' +
                '<ul class="dropdown-menu vue-select-options-ul">' +
                    '<li v-repeat="options" v-on="click:itemClick($index)" v-class="vue-select-option-curr:$index==currIndex">' +
                        '<a href="javascript:;">{{text}}</a>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
        '</div>'
    ,
    data : function (){
        return {
            config : {},
            width: 100,
            display : 'none',
            currIndex : 0,
            options : []
        }
    },
    methods : {
        toggleOptions : function (){
            this.display = this.display == 'none' ? 'block' : 'none'

            if (this.display == 'none'){
                return false
            }

            var $select = $(this.$el)
            var $div = $select.find('.vue-select-options-div')
            var $btn = $select.find('.vue-select-btn')
            var $ul = $select.find('ul')

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
                marginTop = -(btnH + divH + 2)
                scrollTop = 1e4
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
        },
        buttonClick : function (){
            this.toggleOptions()
        },
        itemClick : function (idx){
            this.currIndex = idx
        },
        getVal : function (){
            var data = this.options[this.currIndex]
            return {value:data.value, text:data.text}
        }
    },
    compiled : function (){
        var me = this

        var $dom = $(this.$el)
        var $btn = $dom.find('.vue-select-btn')
        var $optionsDiv = $dom.find('.vue-select-options-div')
        var $caret = $btn.find('.caret')

        $(window).on('click', function (e){
            if (e.target == $btn.eq(0)[0]){
                return
            }
            me.display = 'none'
        })

        $btn.width(this.width)
        $optionsDiv.width(this.width)
    }
})