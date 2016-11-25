/**
 * Created by karka.w on 2014/7/31.
 *
 * Form 表单控件
 *
 */
UI.Form = function(params){

    var _this = this ;

    this.id =  params["id"] ;

    this.ele = typeof params["ele"]   == "object" ? params["ele"]   : $("#" +  params["id"]) ;

    /**调用的路径**/
    this.url = params["url"]||"save.do" ;

    /**是否刷新**/
    this.refresh = params["refresh"] || false;

    /**提交数据的格式 ， string 或 json**/
    this.datatype = params.datatype || "json";

    /**操作成功重定向路径**/
    this.redirect = params["redirect"]  || "list.do";

    /**调用成功后服务器返回的数据**/
    this.data = {};

    /**自定义表单校验器**/
    this.validate =  window[params["validate"]]  || window["validate"];

    UI.apply(this,params);

    this.setUrl = function(url){
        this.url = url ;
    };

    this.success = params["success"];

    UI.apply(this, params);

    this.setRedirectUrl = function (redirectUrl) {
        this.redirect = redirectUrl ;
        if(redirectUrl && $.trim(redirectUrl) != "") {
            _this.refresh = true;
        }
    };

    this.setReflush = function (bool) {
        _this.refresh = bool;
    }

    /**设置参数**/
    this.setParam = function (param){
        for(var key in param ){
            _this.data[key] = param[key];
        }
        return this ;
    };

    /**提交表单**/
    this.submit = function(data,successCallBack){
        //TODO 提交后把按钮置灰
        _this.setBtnDisable();

        //TODO 检验表单，添加默认的校验方式,有校验才校验
        if(_this.validate && ! _this.validate.call(this) ) {
            _this.setBtnEnable();
            return ;
        }

        _this.data = UI.getFormParam(this.ele) ;
        _this.setParam(data || {});

        //提交服务器
        _this.success = successCallBack;
        var ajax = new UI.ajax({url: _this.url, data:_this.data,datatype:_this.datatype});
        ajax.load(function (responseText) {
            _this.completaCallBack(responseText);
        });
    };

    this.setBtnDisable = function () {
        $("button,input[type=button]",$(_this.ele)).attr("disabled",true);
    };

    this.setBtnEnable =function () {
        $("button,input[type=button]",$(_this.ele)).removeAttr("disabled");
    };

    /**操作成功回调函数**/
    this.completaCallBack = function (responseText) {
        var data = responseText ;
        if($.gritter){
            $.gritter.add({
                title: '提示信息',
                text: data.msg || "操作成功！",
                class_name: 'gritter-' + data.msgType
            });
        }else{
            alert(data.msg);
        }

        if(data.code != 200){ //如果从服务器调用失败则不刷新和跳转
            //TODO 处理失败后把按钮置正常
            _this.setBtnEnable();
            return;
        }
        var returned = false;
        _this.success && (returned =_this.success(data));
        // 如果success返回true，则终止后面的刷新操作
        if(!returned) {
            if(_this.refresh) {
                setInterval(function(){
                    window.location.href = _this.redirect ;
                }, 800);
            } else {
                _this.removeValues();
            }
        }
    };

    this.getFormParam = function(){
        var ele = _this.ele ;
        var _params = {};
        //处理设置参数
        var inputs = ele.find("input,select,textarea");
        inputs.each(function(idx,input){
            var val = $(this).val() ;
            if($(this).attr("type") == 'checkbox' && val == 'on'){
                val = 1 ;
            }else if( $(this).attr("type") == 'checkbox' && val == 'off'){
                val = 0;
            }
            var name = $(this).attr("name") || $(this).attr("id") ;
            _params[name] =val;
        });
        return _params;
    };

    this.fillForm = function(successCallBack,completeCallBack){
        //提交服务器
        var ajax = new UI.ajax({  url: _this.url, data:_this.data,datatype:_this.datatype,
            complete:completeCallBack});
        ajax.load(function (data) {
            if(successCallBack){
                successCallBack.call(this,data);
            }else {
                _this.fill(data) ;
            }
        });
    };

    this.fill = function (data) {
        var key,value,tagName,type,arr;
        var aa = data.result
        for(var x in aa){
            key = x;
            value = aa[x];

            _this.ele.find("[name='"+key+"'],[name='"+key+"[]']").each(function(){
                tagName = $(this)[0].tagName;
                type = $(this).attr('type');
                if(tagName=='INPUT'){
                    if(type=='radio'){
                        $(this).attr('checked',$(this).val()==value);
                    }else if(type=='checkbox'){
                        arr = value.split(',');
                        for(var i =0;i<arr.length;i++){
                            if($(this).val()==arr[i]){
                                $(this).attr('checked',true);
                                break;
                            }
                        }
                    }else{
                        $(this).val(value);
                    }
                }else if(tagName=='SELECT' || tagName=='TEXTAREA'){
                    $(this).val(value);
                }

            });
        }
    };

    /**清除表单值，非隐藏的表单**/
    this.removeValues = function(hidden/*true包括隐藏表单, false只清除非隐藏的表单*/){
        UI.removeValues(_this.ele,hidden);
    };

    //获取提交按钮
    this.getSubmit = function(){
        return $("#submitBtn",_this.ele) ;
    };
};