/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-table', {
    template :
        '<table class="table table-bordered table-hover vue-table">' +
            '<thead v-if="isShowHead"><tr>' +
                '<th v-if="isCheckable" class="vue-table-cb-td">' +
                    '<input type="checkbox" v-on="change:masterCbChange" class="vue-table-master-cb"/>' +
                '</th>' +
                '<th v-repeat="c:columns" v-style="width:c.width, text-align:c.textAlign" class="vue-table-th">' +
                    '{{c.text}}' +
                    '<span v-if="c.isSortable" class="glyphicon glyphicon-arrow-up vue-table-glyphicon-disabled" v-on="click:sortClick($index)"></span>' +
                '</th>' +
            '</tr></thead>' +
            '<tbody>' +
                '<tr v-show="!data.length"><td colspan="{{columnsLen}}" class="vue-table-empty">没有任何数据</td></tr>' +
                '<tr v-show="data.length" v-repeat="d:data">' +
                    '<td v-if="isCheckable" class="vue-table-cb-td"><input type="checkbox" v-on="change:cbChange" class="vue-table-cb"/></td>' +
                    '<td v-repeat="c:columns" v-style="text-align:c.textAlign2">{{{d[c["field"]]}}}</td>' +
                '</tr>' +
            '</tbody>' +
            '<tfoot v-if="isShowFoot"><tr><td colspan="{{columnsLen}}" class="vue-table-pager-td">' +
                '<p class="vue-table-totalCount">共 {{totalCount}} 条结果</p>' +
                '<div class="vue-table-pager"><vue-pager v-ref="pager" v-with="config:pagerConfig" vue-id="{{vuePageId}}"></vue-pager></div>' +
            '</td></tr></tfoot>' +
        '</table>'
    ,
    data : function (){
        return {
            config : {},
            data : [], //数据
            totalCount : 0, // 数据总量
            columns : [], //列
            columnsLen : 0, //总列数
            isShowHead : true, //是否显示表格头
            isShowFoot : true, //是否显示表格尾
            isCheckable : false, //是否可以选择数据
            sortField : '', //当前排序字段
            sortDir : 0, //0表示降序，1表示升序
            onSortChange : VueUI.emptyFunc, //当排序信息改变

            //分页相关参数
            pagerConfig : {
                totalPage : 0,
                onChange : VueUI.emptyFunc
            },
            totalPage : 0,
            onPagerChange : VueUI.emptyFunc,
            vuePageId : VueUI.getComId() + '_table_pager'
        }
    },
    watch : {
        totalPage : function (){
            this.pagerConfig.totalPage = this.totalPage
        },
        onPagerChange : function (){
            this.pagerConfig.onChange = this.onPagerChange
        },
        data : function (){
            var me = this
            this.unCheckedMaster()

            if (this.data.length > 0){
                me.compileTbody()
            }
        },
        sortField : function (){
            this.syncSort()
        },
        sortDir : function (){
            this.syncSort()
        }
    },
    methods : {
        compileTbody : function (){
            this.$compile(this.$el.getElementsByTagName('tbody')[0])
        },
        sortClick : function (idx){
            var column = this.columns[idx]
            if (!column.isSortable){
                return
            }

            this.sortField = column.field
            column.sortDir = (column.sortDir=='0') ? '1' : '0'
            this.sortDir = column.sortDir

            this.onSortChange(this.sortField, this.sortDir)
        },
        syncSort : function (){ //同步排序相关
            var me = this
            var columns = me.columns

            me.$$el.find('.vue-table-th').each(function (idx){
                var arrow = $(this).find('.glyphicon')
                if (!arrow.length){
                    return
                }
                if (me.sortField == columns[idx].field){
                    arrow.attr('class', 'glyphicon glyphicon-arrow-' + ['up', 'down'][me.sortDir])
                }
                else {
                    arrow.addClass('vue-table-glyphicon-disabled')
                }
            })

        },
        masterCbChange : function (e){
            var cbs = this.$$el.find('.vue-table-cb').prop('checked', e.target.checked)
        },
        cbChange : function (){
            var me = this
            var isAllChecked = true

            me.$$el.find('.vue-table-cb').each(function (){
                if (!this.checked){
                    isAllChecked = false
                    return false
                }
            })

            me.$$el.find('.vue-table-master-cb').prop('checked', isAllChecked)
        },
        unCheckedMaster : function (){
            if (!this.isCheckable){
                return
            }
            this.$$el.find('.vue-table-master-cb').prop('checked', false)
        },
        handleColumns : function (){
            function getDefaultConf(){
                return {
                    width : 150,
                    textAlign : 'left',
                    isSortable : false
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

                if (!c.textAlign2){
                    c.textAlign2 = c.textAlign
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
        },
        getChecked : function (){
            var me = this
            var data = []

            me.$$el.find('.vue-table-cb').each(function (idx){
                if ($(this).prop('checked')){
                    data.push(me.data[idx])
                }
            })

            return data
        }
    },
    compiled : function (){
        this.$$el = $(this.$el)
        this.pager = VueUI.$(this.vuePageId)
        this.handleColumns()

        this.columnsLen = this.columns.length
        if (this.isCheckable){
            this.columnsLen ++
        }
    }
})