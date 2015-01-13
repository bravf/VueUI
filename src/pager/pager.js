VueUI.component('vue-pager', {
    template :
    '<div class="vue-pager">' +
        '<ul class="pagination pagination-sm">' +
            '<li v-repeat="pageRange" v-on="click:pageChange(num)" v-class="className">' +
                '<a>{{num}}</a>' +
            '</li>' +
        '</ul>' +
    '</div>',
    data : function (){
        return {
            totalPage : 0,
            currPage : 1,
            preShow : 3,
            nextShow : 3,
            pageRange : [],
            onPageChange : VueUI.emptyFunc
        }
    },
    watch : {
        totalPage : function (){
            this.getPageRange()
        }
    },
    methods : {
        getPageRange : function (){
            var start = 0
            var end = 0
            var showLen = this.preShow + this.nextShow + 1
            var totalPage = this.totalPage

            if (totalPage <= 1){
                start = end = 1
            }
            else if (totalPage <= showLen){
                start = 1
                end = totalPage
            }
            else {
                if (this.currPage <= this.preShow + 1){
                    start = 1
                    end = showLen
                }
                else if (this.currPage >= totalPage - this.nextShow){
                    end = totalPage
                    start = totalPage - showLen + 1
                }
                else {
                    start = this.currPage - this.preShow
                    end = this.currPage + this.nextShow
                }
            }

            this.pageRange = []

            //上一页
            if (this.currPage != 1){
                this.pageRange.push({num:'«'})
            }
            //第一页
            if (start >= 2){
                this.pageRange.push({num:1})
            }
            //省略好
            if (start > 2){
                this.pageRange.push({num:'..'})
            }
            //显示的页码列表
            for (var i=start; i<=end; i++){
                this.pageRange.push({
                    num : i,
                    className : (i==this.currPage)?'active':''
                })
            }
            //省略号
            if (end < totalPage-1){
                this.pageRange.push({num:'..'})
            }
            //最后一页
            if (end <= totalPage-1){
                this.pageRange.push({num:totalPage})
            }
            //下一页
            if (this.currPage != totalPage){
                this.pageRange.push({num:'»'})
            }
        },
        pageChange : function (i){
            this.currPage = i
            this.getPageRange()
            this.onPageChange(i)
        }
    },
    compiled : function (){
        this.getPageRange()
    }
})