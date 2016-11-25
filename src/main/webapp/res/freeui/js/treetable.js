

UI.TreeTable = function (param) {

    var _this = this;

    this.id = param["id"];

    this.ele = null;

    this.nodeIdName = param.nodeIdName || "id";
    this.parentIdName = param.parentIdName || "parent_id";
    this.childrenName = param.childrenName || "children";

    this.url = param["url"];
    this.params= param.params || {};
    this.noneJSONParam = !!param.noneJSONParam; // 提交是的参数名称是否为不为json
    this.paramName = param.paramName || "json"; //如果nonjsonParam为true，则使用该参数指定的名称，如果为空或null，则不提供参数名称。

    this.data ={};
    this.getNodeId = function(data){return data[_this.nodeIdName]};
    this.getParentId = function(data) {return data[_this.parentIdName]};
    this.getChildren = function(data) {return data[_this.childrenName]};
    this.onSelected = param.onSelected || function(){}; // 选择时的回调

    //是否多选
    this.mutil = param["mutil"] ? true :false ;

    this.setUrl = function(url){
        this.url = url;
    };

    this.init = function(){
        _this.initModel();
    };

    this.initModel = function(){

        _this.load();
        //table变化时调整列宽度
        _this.resizeTable();
    };
    this.resizeTable = function(){
        $("#"+_this.id+"_thead").find("th").each(function(idx,el){
            var th = $(el);
            var tds = $("#"+_this.id+" tbody > tr").eq(0).find("td").eq(idx);
            tds.css({width:th.width()});
        });
    };

    /**设置参数**/
    this.setParam = function (param){
        for(var key in param ){
            _this.params[key] = param[key];
        }
        return this ;
    };

    this.load = function(params, callback){//从服务器获取数据
        params = params || {};
        _this.params = $.extend(_this.params, params);
        var leader = new  UI.ajax({url:_this.url,data:_this.params, noneJSONParam : _this.noneJSONParam, paramName : this.paramName});
        leader.load(function(data){
            if(!data){
                return;
            }
            if(data.msgType && $.trim(data.msgType) != ""){
                _this.data =  data.result || {};
                if( data.msgType == 'page'){//判断是否分页,如果不是显示所有的数据
                    _this.data = _this.data.result || _this.data.list;
                }
            }else{ //数据不是返回jsonResult对象时，直接返回集合
                _this.data =  data ;
            }
            _this.fill();
            $("#" + _this.id).treetable({expandable: true, onNodeInitialized : function(){
                //展开节点
                this.expand();
            }, onInitialized : function(tree) {
                _this.tree = this;
            }});

            // 节点选中时高亮
            _this._highlightSelected();
            //回调
            callback &&　callback();
        });
    };

    this._highlightSelected = function(){
        $("tr", $("tbody", $("#" + _this.id))).unbind("mousedown").bind("mousedown", function() {
            $(".selected").removeClass("selected");
            $(this).toggleClass("selected");
            _this.onSelected($(this).data("data"));
        });
    }

    this.fill = function(d, index){//填充grid数据
        var data = d && [].concat(d);
        data = data || [].concat(_this.data);
        index = index || 0;

        var tby = $("#" + _this.id).find("tbody");
        for (var i = 0; i < data.length; i++) {
            index++;
            var trData = data[i];
            var tr = tby.find("tr:eq(" + index + ")");

            if (tr.size() == 0) {
                _this.addRow(trData);
                tr = tby.find("tr:eq(" +  index  + ")");
            }

            _this.fillTR(tr, trData);

            var children = _this.getChildren(trData);
            if(children && children.length > 0) {
                index = _this.fill(children, index);
            }
        }
        return index;

    };

    this.fillTR = function(tr, data) {
        var tds = tr.find("td");
        for(var ti = 0; ti< tds.length; ti++) {
            var td = tds[ti];
            var name = $(td).attr('name');
            if(name) {
                var name_method = name.split('?');
                name = name_method[0];
                var method = name_method.length==2?name_method[1]:null;
                var nps = name.split('.');
                var value = data;
                for(var ni = 0; ni < nps.length; ni++) {
                    if(!value)break;
                    value = value[nps[ni]];
                }
                //自定义函数加载数据
                var onload = $(td).attr('onload');
                if(onload && typeof window[onload] == 'function') {
                    window[onload].call(td, data, value);
                    continue;
                }
                //系统加载数据
                value = value || "";
                if(method) {
                    //执行格式化函数
                    var f = _this[method] || window[method] || null;
                    f && (value = f(value));
                }
                if($(td).has("input:checkbox,input:radio").length > 0){
                    $(td).find("input:checkbox,input:radio").val(value);
                }else{
                    $(td).empty().append(value);
                }
            }
        }
    }


    //动态添加行
    this.addRow = function (data) {
        var tby = $("#" +_this.id).find("tbody");
        var tr = tby.find("tr:first");
        //默认取消多选的事件
        tr.find("input:checkbox,input:radio").unbind("click").bind('click',function(e){

        });
        var ntr =  tr.clone(true);
        ntr.data("data",data);

        var nodeId = _this.getNodeId(data);
        ntr.attr("data-tt-id", nodeId);
        var parentId = _this.getParentId(data);
        if(parentId && $.trim(parentId) != '') {
            ntr.attr("data-tt-parent-id", parentId);
        }

        ntr.show();
        ntr.appendTo(tby);

        //选择一行的样式
        var select = ntr.find("input:checkbox,input:radio");
        select.unbind("click").bind('click', function () {
            var _idx = $(this).parent().parent("tr").index() ;
            _this.selection = _this.data[_idx-1] || null;

            if(!_this.mutil){//如果是单选
                $("#"+_this.id).find("input:checkbox,input:radio").each(function(idx,el){
                    if(_idx != idx){
                        this.checked = false;
                        $(this).parent().parent("tr").removeClass('success');
                    }
                });
            }
            if(this.checked){
                $(this).parent().parent("tr").removeClass('success').addClass('success');
            }else{
                $(this).parent().parent("tr").removeClass('success');
                _this.selection = null ;
            }
        });
    };

    this.clear = function(){
        $("#" + _this.id).treetable("destroy");
        var tby = $("#" + _this.id).find("tbody");
        tby.find("tr").each(function(idx,el){
            if(idx==0) {
                $(el).css("display","none");
                return;
            }
            $(this).remove();
        });
        _this.data = {};
    }

    this.reload = function(params, callback){
        if(params && typeof params == 'function') {
            callback = params;
            params = {};
        }
        for(var k1 in params){
            _this.params[k1] = params[k1];
            if(params[k1] == null || params[k1] == ""){
                delete _this.params[k1];
            }
        }
        _this.clear();
        _this.load(_this.params, callback);
    };

    this.init();
};