/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-suggest', {
    template :
        '<div class="vue-suggest">' +
            '<input class="form-control" v-model="words" v-on="keydown:keydown, focus:focus, blur:blur"/>' +
            '<div class="vue-suggest-options-div" v-show="display">' +
                '<ul class="dropdown-menu vue-suggest-options-ul">' +
                    '<li v-repeat="data" v-on="click:itemClick($index)" v-class="vue-suggest-option-curr:$index==index">' +
                        '<a href="javascript:;">{{text}}</a>' +
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
            valid : false,      //是否校验是有效值

            value : '',         //当前值
            text : '',          //当前文本
            index : -1,         //suggest索引

            url : '',            //请求地址
            words : '',          //请求参数
            words2 : '',
            field : 'words',     //请求字段名

            filterData : function (data){   //处理返回数据
                return data
            }
        }
    },
    watch : {
    },
    methods : {
        keydown : function (e){
            var me = this
            var kc = e.keyCode

            if (kc == 13){             //enter
                this.display = false
            }
            else if (kc == 8){          //删除
                this.value = this.text = ''
            }
            else if (kc==38 || kc==40){
                if (!this.display){
                    return
                }

                if (kc == 38){
                    this.index--
                }
                else if (kc==40){
                    this.index++
                }

                this.setValue()
            }
            else {
                Vue.nextTick(function (){
                    if (me.words != me.words2){
                        me.words2 = me.words
                        me.sendRequest()
                    }
                })
            }
        },
        focus : function (){
            if (this.words){
                this.sendRequest()
            }
        },
        blur : function (){
            this.display = false
            if (this.valid && !this.value){
                this.words = ''
            }
        },
        sendRequest : function (){
            var me = this
            var params = {}

            this.value = this.text = ''

            params[this.field] = this.words2
            params['-'] = +new Date

            $.getJSON(this.url, params).done(function (data){
                me.data = me.filterData(data)
                me.index = -1
                if (me.data.length){
                    me.display = true
                }
            })
        },
        setValue : function (){
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
            this.text = this.words = this.data[this.index].text
        },
        itemClick : function (idx){
            this.index = idx
            this.setValue()
            //this.display = false
        }
    },
    compiled : function (){
        var me = this
        me.$$el = $(me.$el)

        //设置宽度
        me.$$el.find('.vue-suggest').outerWidth(me.width)
        me.$$el.find('.vue-suggest-options-div').outerWidth(me.width)
    }
})