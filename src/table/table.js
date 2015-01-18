/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-table', {
    template :
        '<table class="table table-condensed table-bordered table-hover">' +
            '<thead><tr>' +
                '<th v-repeat="c:columns">{{c["text"]}}</th>' +
            '</tr></thead>' +
            '<tbody>' +
                '<tr v-repeat="d:data">' +
                    '<td v-repeat="c:columns">{{d[c["field"]]}}</td>' +
                '</tr>' +
            '</tbody>' +
            '<tfoot><tr><td colspan="{{columns.length}}" class="vue-table-pager-td">' +
                '<vue-pager v-ref="pager"></vue-pager>' +
            '</td></tr></tfoot>' +
        '</table>'
    ,
    data : function (){
        return {
            config : {},
            //数据
            data :[],
            //列
            columns : []
        }
    },
    watch : {
    },
    methods : {
    },
    compiled : function (){
        //处理columns
        var columns = this.columns
        if (columns.length){
            for (var i=0,c; i<columns.length; i++){
                c = columns[i]
                if ($.type(c) == 'string'){
                    columns[i] = {'field':c, 'text':c}
                }
            }
        }
        //处理pager
        console.log(this.$.pager)
        this.$.pager.totalPage = 100
    }
})