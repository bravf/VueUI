/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

window.VueUI = function (){
    var VueUI = {}

    var componentPool = {}
    var comCounter = 1

    function getComId(){
        return (new Date).getTime()/1000 + '_' + comCounter
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

            me[b] = parentObj[parentAttr]

            me.$parent.$watch(attr, function (){
                me[b] = parentObj[parentAttr]
            })
            me.$watch(b, function (){
                parentObj[parentAttr] = me[b]
            })
        })
    }

    VueUI.emptyFunc = Function.prototype

    VueUI.component = function (key, options){
        //在created方法中做一些全局管理操作
        var _compiled = options['compiled'] || VueUI.emptyFunc

        options['compiled'] = function (){
            //设置id，并保存到pool
            var comId = this.$el.getAttribute('vue-id') || getComId()
            componentPool[comId] = this

            handleVueModel.call(this)
            mixConfig.call(this)
            syncConfig.call(this)

            _compiled.call(this)
        }
        //调用系统的方式
        Vue.component(key, options)
    }

    VueUI.getComponent = function (id){
        return componentPool[id]
    }

    return VueUI

}()