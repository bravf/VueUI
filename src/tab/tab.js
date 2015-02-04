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