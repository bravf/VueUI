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