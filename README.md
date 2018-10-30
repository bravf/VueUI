请关注([Rainbow][6])组件。
======================

VueUI (停止更新！！！)
======================
依赖bootstrap,jquery,vue.js，使用之前引用：
```
<link href="dist/vueUI.css" rel="stylesheet">
<script src="dist/vueUI.js"></script>
```

## datepicker组件 ([Demo][1])
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

## pager组件 ([Demo][2])
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

## select组件 ([Demo][3])
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
##table组件 ([Demo][4])
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
##modal(模态框 [Demo][5])
```
//内置alert,confirm行为和浏览器自带方法一致
VueUI.alert('hello,world!')
VueUI.alert({
    title : '', //可选，如果为空则被document.title取代
    content : 'hello,world',
    okCallback : function (){} //可选，当点击确认按钮后发生的操作
})

VueUI.confirm({
    title : '', //可选，如果为空则被document.title取代
    content : 'hello,world',
    okCallback : function (){}, //可选，当点击确认按钮后发生的操作
    cancelCallback : function (){} //可选，当点击取消按钮后发生的操作
})
```

```
//自定义模态框

//html
<vue-modal v-with="config:conf" vue-id="logModal">
    <h4>日志列表</h4>
    <vue-table v-with="config:tableConf"></vue-table>
</vue-modal>
<button class="btn btn-default" v-on="click:vModal">modal</button>

//js
new Vue({
    el : '#pagerTest',
    data : {
        conf : {
            width : 600
        },
        tableConf : {
            columns : ['id', 'name', 'math']
        }
    },
    methods : {
        vModal : function (){
            VueUI.getComponent('logModal').toggle = true
        }
    }
}
```

##tab（选项卡）
```
//html
<vue-tab v-with="config:conf" vue-id="myTab">
    <ul class="nav nav-tabs">
        <li>
            <a href="javascript:;">tab1</a>
        </li>
        <li>
            <a href="javascript:;">tab2</a>
        </li>
        <li>
            <a href="javascript:;">tab3</a>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane">
            <vue-table></vue-table>
        </div>
        <div class="tab-pane">content2</div>
        <div class="tab-pane">content3</div>
    </div>
</vue-tab>

//js
new Vue({
    el : '#tabTest',
    data : {
        conf : {
            active : 1 //初始索引
        }
    }
})
```


  [1]: http://sandbox.runjs.cn/show/yamvreus
  [2]: http://sandbox.runjs.cn/show/4abmqavu
  [3]: http://sandbox.runjs.cn/show/z0dcccbo
  [4]: http://sandbox.runjs.cn/show/31opvmzw
  [5]: http://sandbox.runjs.cn/show/22u2abu6
  [6]: https://github.com/bravf/rainbow
