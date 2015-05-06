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