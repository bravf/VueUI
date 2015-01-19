/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-table', {
    template :
        '<table class="table table-condensed table-bordered table-hover">' +
            '<thead v-if="isShowHead"><tr>' +
                '<th v-repeat="c:columns" v-style="width:c.width, text-align:c.textAlign">{{c["text"]}}</th>' +
            '</tr></thead>' +
            '<tbody>' +
                '<tr v-repeat="d:data">' +
                    '<td v-repeat="c:columns" v-style="text-align:c.textAlign">{{d[c["field"]]}}</td>' +
                '</tr>' +
            '</tbody>' +
            '<tfoot v-if="isShowFoot"><tr><td colspan="{{columns.length}}" class="vue-table-pager-td">' +
                '<vue-pager v-ref="pager" v-with="config:pagerConfig"></vue-pager>' +
            '</td></tr></tfoot>' +
        '</table>'
    ,
    data : function (){
        return {
            config : {},
            data : [], //数据
            columns : [], //列
            isShowHead : true, //是否显示表格头
            isShowFoot : true, //是否显示表格尾

            //分页相关参数
            pagerConfig : {
                totalPage : 0,
                onChange : VueUI.emptyFunc
            },
            totalPage : 0,
            onPagerChange : VueUI.emptyFunc
        }
    },
    watch : {
        totalPage : function (){
            this.pagerConfig.totalPage = this.totalPage
        },
        onPagerChange : function (){
            this.pagerConfig.onChange = this.onPagerChange
        }
    },
    methods : {
        _handleColumns : function (){
            function getDefaultConf(){
                return {
                    width : 150,
                    textAlign : 'center'
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
        }
    },
    compiled : function (){
        this._handleColumns()
    }
})