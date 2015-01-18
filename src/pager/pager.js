/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

VueUI.component('vue-pager', {
    template :
    '<div class="vue-pager">' +
        '<ul class="pagination pagination-sm vue-pager-pagination">' +
            '<li v-repeat="pageRange" v-on="click:pageClick(num)" v-class="className">' +
                '<a href="javascript:;">{{text}}</a>' +
            '</li>' +
        '</ul>' +
    '</div>',
    data : function (){
        return {
            pageRange : [],
            totalPage : 0,
            currPage : 1,
            prevShow : 3,
            nextShow : 3,
            onChange : VueUI.emptyFunc,
            config : {}
        }
    },
    watch : {
        totalPage : function (){
            this.getPageRange()
        },
        currPage : function (){
            this.getPageRange()
            this.onChange(this.currPage)
        },
        prevShow : function (){
            this.getPageRange()
        },
        nextShow : function (){
            this.getPageRange()
        }
    },
    methods : {
        getPageRange : function (){
            var start = 0
            var end = 0
            var showLen = this.prevShow + this.nextShow + 1
            var totalPage = Math.max(this.totalPage, 1)
            var currPage = this.currPage

            if (totalPage <= 1){
                start = end = 1
            }
            else if (totalPage <= showLen){
                start = 1
                end = totalPage
            }
            else {
                if (currPage <= this.prevShow + 1){
                    start = 1
                    end = showLen
                }
                else if (currPage >= totalPage - this.nextShow){
                    end = totalPage
                    start = totalPage - showLen + 1
                }
                else {
                    start = currPage - this.prevShow
                    end = currPage + this.nextShow
                }
            }

            this.pageRange = []

            //上一页
            if (currPage != 1){
                this.pageRange.push({num:currPage-1, text:'«'})
            }
            //第一页
            if (start >= 2){
                this.pageRange.push({num:1, text:1})
            }
            //省略好
            if (start > 2){
                this.pageRange.push({text:'..'})
            }
            //显示的页码列表
            for (var i=start; i<=end; i++){
                this.pageRange.push({
                    num : i,
                    text : i,
                    className : (i==currPage) ? 'active' : ''
                })
            }
            //省略号
            if (end < totalPage-1){
                this.pageRange.push({text:'..'})
            }
            //最后一页
            if (end <= totalPage-1){
                this.pageRange.push({num:totalPage, text:totalPage})
            }
            //下一页
            if (currPage != totalPage){
                this.pageRange.push({num:currPage+1, text:'»'})
            }
        },
        pageClick : function (i){
            if (!i){
                return false
            }
            if (i == this.currPage){
                return false
            }

            this.currPage = i
            this.getPageRange()
        }
    },
    compiled : function (){
        this.getPageRange()
    }
})