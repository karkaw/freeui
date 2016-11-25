UI.Modal = function(param){

    var _this = this ;

    this.id = '#' + param.id ;
    this.ele = typeof param["ele"]   == "object" ? param["ele"]   : $("#" +  param["id"])
    this.onShow = param.onShow || function(){};
    this.params = {};

    /**设置参数**/
    this.setParams = function (param){
        for(var key in param ){
            _this.params[key] = param[key];
        }
        return this ;
    };
    //显示
    //beforeCall为modal显示前的无参回调函数，因此可以在modal显示前对modal做初始化操作
    this.show = function(beforeCall){

        beforeCall && typeof beforeCall == 'function' && beforeCall();
        _this.ele.modal({
            show : true,
            width: '100%'
        });
        _this.onShow(_this.params);
    };

    this.css = function(css){
        _this.ele.find(".modal-dialog").css(css);
    }

    //隐藏
    this.hide = function(){
        _this.ele.modal('hide');
    };

    //添加按钮
    this.addButton = function(id,label){
        if(!$("#"+id).length>0){
            var button = $('<button type="button" class="btn btn-primary" id="'+id+'">'+label+'</button>') ;
            button.prependTo( _this.ele.find(".modal-footer") );
            button.unbind("click");
            return button;
        }else{
            $("#"+id).unbind("click");
            return $("#"+id);
        }
    };


    //获取提交按钮
    this.getSubmitBtn = function(){
        var btn = $("#submitBtn",_this.ele) ;
        btn.unbind("click");
        return btn;
    };
    
    //获取modal内容体
    this.getBody = function(){
    	return $(".modal-body",_this.ele);
    };

    /**模态框隐藏时触发**/
    $(this.id).on('hide.bs.modal', function () {
        // 执行一些动作...
        UI.resetForm($("form"),_this.ele);
    })

    /**模态框显示时触发**/
    $(this.id).on('show.bs.modal', function () {
        // 执行一些动作...

    })

};