/*
    Copyright (c) 2015 bravf(bravfing@126.com)
*/

var VueUI = function (){
    var VueUI = {}

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

    VueUI.emptyFunc = Function.prototype

    VueUI.component = function (key, options){
        //在created方法中做一些全局管理操作
        var _compiled = options['compiled'] || VueUI.emptyFunc

        options['compiled'] = function (){
            mixConfig.call(this)
            syncConfig.call(this)

            _compiled.call(this)
        }
        //调用系统的方式
        Vue.component(key, options)
    }

    return VueUI

}()