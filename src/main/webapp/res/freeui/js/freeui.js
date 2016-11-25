/**
 * Created by karka.w on 2014/7/31.
 */

var UI = { elements:{},ajax:{}};

(function () {

    /**通过ID获取控件**/
    UI.get = function (tid) {
        return UI.elements[tid];
    };

    /**复制并覆盖属性**/
    UI.apply = function (object, config, defaults) {
        if (defaults) {
            UI.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            for (var i in config) {
                object[i] = config[i];
            }
        }

        return object;
    };

    /**复制不覆盖属性**/
    UI.applyIf = function (object, config) {
        var property;
        if (object) {
            for (property in config) {
                if (object[property] === undefined) {
                    object[property] = config[property];
                }
            }
        }
        return object;
    };

    /**获取表单元素并组装成Json**/
    UI.getFormParam = function(_el_){
        var el = typeof _el_ == "object" ?  _el_   : $("#" + _el_) ;
        var _params = {};
        //处理设置参数
        var inputs = el.find("input,select,textarea");
        inputs.each(function(idx,input){
            var val = $(this).val() ;
            if(val != null && val != ""){
                var name = $(this).attr("name") || $(this).attr("id") ;
                if($(this).attr("type") == 'checkbox' && val == 'on'){
                    val = 1 ;
                }else if( $(this).attr("type") == 'checkbox' && (val == 'off'|| val == '')){
                    val = 0;
                }else if($(this).attr("type") == 'radio' ){
                    val = $("input[name="+name+"]:checked").val();
                }

                var isArray = false;
                if($(this).attr("data-array") == "true" || $(this).attr("type") == 'checkbox'){
                    isArray = true;
                }
                var index = $(this).attr("data-array-index");

                if($(this).attr("type") == 'checkbox' && !$(input).is(":checked")){
                    val = null;
                }

                var converter = $(this).attr("data-type") && UI.typeConverter[$(this).attr("data-type")]
                if(converter){
                    val = converter(val);
                }

                setValueForKeyPath.call(_params, val, name, isArray, index);

            }
        });
        return _params;
    };

    UI.typeConverter = {
        number : function(data){
            return Number(data);
        },
        boolean : function(data) {
            return Boolean(data);
        },
        string : function(data){
            return String(data);
        },
        integer : function(data) {
            return parseInt(data);
        },
        float : function(data){
            return parseFloat(data);
        }
    };

    function setValueForKeyPath(value, keyPath, isArray, index) {

        if(!value) return;

        var obj = this;
        var keys = [];
        if(keyPath && $.trim(keyPath).length>0) {
            keys = keyPath.split('.')
        }
        for(var i=0; i < keys.length; i++){
            var el = keys[i];
            if(i != keys.length - 1){
                if(!obj[el]){
                    obj[el] = {};
                }
                obj = obj[el];
            } else {
                if(isArray) {
                    if(!obj[el] ) {
                        obj[el]  = [];
                    }

                    if(index || index == 0) {
                        obj[el][index] = value;
                    } else {
                        obj[el].push(value);
                    }

                } else  {
                    obj[el]  = value;
                }
            }
        }
    }

    /**重置表单的值**/
    UI.resetForm = function(_el_){
        var el = typeof _el_ == "object" ?  _el_   : $("#" + _el_) ;
        var inputs = el.find("input,select,textarea");
        inputs.each(function(){
           if($(this).is(":checked")){
               $(this).attr("checked",false);
           }else{
               $(this).val("") ;
           }
        });
    };

    /**清除表单值，非隐藏的表单,true包括隐藏表单, false只清除非隐藏的表单*/
    UI.removeValues = function(_el_,hidden){
        var el = typeof _el_ == "object" ?  _el_   : $("#" + _el_) ;
        var inputs = el.find("input,select,textarea");
        inputs.each(function(idx , ele ){
            if($(this).is(":checkbox")){
                ele.checked = false ;
                return ;
            }
            if($(this).not(":hidden") || !hidden){
                $(this).val("") ;
            }
        });
    };

    UI.unique=function(arr) {
        if(arr){
            var result = [], hash = {};
            for (var i = 0, elem; (elem = arr[i]) != null; i++) {
                if (!hash[elem]) {
                    result.push(elem);
                    hash[elem] = true;
                }
            }
            return result;
        }
    }

    /**公共的Ajax接口**/
    UI.ajax = function(cfg){
    	var _this = this;

        this.url = null;

        this.method = 'post';

        this.data = {};

        /**传参格式**/
        this.datatype = 'json' || 'string';

        /**如果传参格式是string格式，则以{key:datastr}的格式传参**/
        this.key = 'json'

        this.complete = function (responseText) {

        };
        
        this.error = function (responseText) {
            
        };

        UI.apply(this, cfg);

        this.load = function (callback, scope) {
            var data = {};
            if(_this.datatype == 'json' && this.data) {
                data = _this.data;
            } else if (_this.datatype == 'string'){
                data[_this.key] = JSON.stringify(_this.data);
            }
            data['date'] = new Date();
            $.ajax({
                type:'post',
                url:_this.url,
                data: data,
                datatype:_this.datatype,
                success:function (responseText) {
                    if(callback){
                        var data = responseText;
                        callback.call(scope || _this, data == null ? {info:{}, result:null} : data);
                    }
                },
                complete:function () {
                    if(_this.complete){
                        _this.complete.call(scope || _this,data == null ?{info:{},result:null}:data);
                    }
                },
                error:function () {
                    if(_this.error){
                        _this.error.call(scope || _this,data == null ?{info:{},result:null}:data);
                    }
                }
            });
        };
    };
})();

