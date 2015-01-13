/*
    Copyright (c) 2014 bravf(bravfing@126.com)
*/

var VueUI = function (){
    var VueUI = {}
    var componentPool = {}
    var comIdCount = 0

    function getComId(){
        return (new Date()).getTime()/1000 + '_' + comIdCount
    }

    VueUI.emptyFunc = Function.prototype

    VueUI.component = function (key, options){
        //在created方法中做一些全局管理操作
        var _compiled = options['compiled'] || VueUI.emptyFunc

        options['compiled'] = function (){
            if (!this.comId){
                this.comId = getComId()
            }
            componentPool[this.comId] = this
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