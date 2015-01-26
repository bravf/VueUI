VueUI
======================
依赖bootstrap,jquery,vue.js，使用之前引用：
```
<link href="dist/vueUI.css" rel="stylesheet">
<script src="dist/vueUI.js"></script>
```

## datepicker组件
```
html:
<div id="datepickerTest">
    <vue-datepicker vue-model="sDate" vue-id="myDP">
    </vue-datepicker>
</div>

js:
new Vue({
    el : '#datepickerTest',
    data : {
        sDate : '2015-02-14'
    }
})
```

## pager组件
```
html:
<div id="pagerTest">
    <vue-pager v-with="config:pagerConf" vue-id="firstPager">
    </vue-pager>
</div>

js:
var pagerConf = {
    totalPage : 0,
    currPage : 1,
    prevShow : 3,
    nextShow : 3,
    onChange : function (num){
        console.log(num)
    }
}

new Vue({
    el : '#pagerTest',
    data : {
        pagerConf : pagerConf
    }
})
```

## select组件
```
html:
<vue-select v-with="config:selectConf" vue-model="step1.selectValue" vue-id="mySelect">
    <option value="1">江苏省南通市1</option>
    <option value="2">江苏省南通市2</option>
    <option value="3">江苏省南通市3</option>
    <option value="4">江苏省南通市4</option>
    <option value="5">江苏省南通市5</option>
</vue-select>

js:
var selectConf = {
    data : [],
    width : 130,
    onChange : function (value){
        //console.log(value)
    }
}
new Vue({
    el : '#selectTest',
    data : {
        selectConf : selectConf,
        step1 : {
            selectValue : 3
        }
    }
})
//selectConf.data = [{value:'',text:''},...]
//VueUI.getComponent('mySelect')
```
##table组件
```
html:
<vue-table v-with="config:tableConf" vue-id="myTable"></vue-table>

js:
var tableConf = {
    //isShowHead : false,
    //isShowFoot : false,
    isCheckable : true,
    columns : [
        {'field':'name', 'isSortable':true},
        'math',
        'chinese',
        {'field':'english', 'text':'英语', 'textAlign':'left','isSortable':true},
        'operate'
    ],
    onPagerChange : function (num){
        getData(num)
    },
    onSortChange : function (field, dir){
        console.log(field)
        console.log(dir)
    }
}
new Vue({
    el : '#tableTest',
    data : {
        tableConf : tableConf
    }
})
```