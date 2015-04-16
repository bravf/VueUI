/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

window.VueUI = function (){
    var VueUI = {}

    var componentPool = {}
    var comCounter = 1

    function getComId(){
        return (new Date).getTime() + '_' + comCounter
    }

    //将外部传进来的参数mix到data
    function mixConfig(){
        for (var key in this.config){
            this[key] = this.config[key]
        }
    }

    //监控外部参数的变化同步到data
    function syncConfig(){
        var me = this
        me.$watch('config', function (){
            mixConfig.call(me)
        }, true)
    }

    //处理vue-attr
    function handleVueAttr(){
        var me = this

        ;[].slice.call(me.$el.attributes).forEach(function (item){
            var key = item.name
            var value = item.value

            if (key.indexOf('vue-attr-') == 0){
                me[key.slice(9)] = value 
            }
        })
    }

    //处理vue-model
    function handleVueModel(){
        var me = this

        ;[{a:'vue-model', b:'value'}, {a:'vue-model-text', b:'text'}].forEach(function (item){
            var a = item.a
            var b = item.b

            var attr = me.$el.getAttribute(a)
            if (!attr){
                return
            }

            var parentObj = me.$parent
            var parentAttr = attr

            var attrList = attr.split('.')

            if (attrList.length > 1){
                attrList.slice(0, -1).forEach(function (k){
                    parentObj = parentObj[k]
                })
                parentAttr = attrList.slice(-1)[0]
            }

            //只有vue-model是双向（多重双向会导致数据混乱）
            if (a == 'vue-model'){
                me[b] = parentObj[parentAttr]
                me.$parent.$watch(attr, function (){
                    me[b] = parentObj[parentAttr]
                })
            }

            me.$watch(b, function (){
                parentObj[parentAttr] = me[b]
            })
        })
    }

    VueUI.component = function (key, options){
        //在created方法中做一些全局管理操作
        var _compiled = options['compiled'] || VueUI.emptyFunc

        options['compiled'] = function (){
            //设置id，并保存到pool
            var comId = this.$el.getAttribute('vue-id') || getComId()
            componentPool[comId] = this

            handleVueAttr.call(this)
            handleVueModel.call(this)
            mixConfig.call(this)
            syncConfig.call(this)

            _compiled.call(this)
        }
        //调用系统的方式
        Vue.component(key, options)
    }

    VueUI.getComponent = VueUI.$ = function (id){
        return componentPool[id]
    }

    VueUI.getComId = getComId
    VueUI.emptyFunc = Function.prototype

    VueUI.resetArray = function (a, b){
        while (a.length){
            a.pop()
        }
        b.forEach(function (x){
            a.push(x)
        })
    }

    VueUI.winClick = function (targetDom, callback){
        $(window).on('click', function (e){
            var dom = e.target

            while (dom){
                if (dom == targetDom){
                    return
                }
                dom = dom.parentElement
                if (dom == document.body){
                    break
                }
            }

            callback()
        })
    }

    return VueUI

}()