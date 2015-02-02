/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-tab', {
    template :
        '<div class="vue-tab">' +
            '<div class="vue-tab-content"><content></content></div>' +
            '<ul class="nav nav-tabs vue-tab-ul"></ul>' +
            '<div class="tab-content vue-tab-div"></div>' +
        '</div>',
    data : function (){
        return {
            config : {},
            active : 0
        }
    },
    watch : {
    },
    methods : {
    },
    compiled : function (){
        this.$$el = $(this.$el)

        var $tabs = this.$$el.find('.vue-tab-content>ul>li')
        var $contents = this.$$el.find('.vue-tab-content>div>div')

        var $tabUl = this.$$el.find('.vue-tab-ul')
        var $tabDiv = this.$$el.find('.vue-tab-div')

        $tabs.each(function (){
            $tabUl.append($(this))
        })

        $contents.each(function (){
            $tabDiv.append($(this))
        })
    }
})