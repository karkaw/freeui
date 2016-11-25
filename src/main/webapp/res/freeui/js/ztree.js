UI.ZTree = function (param) {

    var _this = this;

    this.id = param["id"];

    this.ele = null;

    // 节点设置
    this.nodeIdName = param.nodeIdName || "id";
    this.parentIdName = param.parentIdName || "parent_id";
    this.childrenName = param.childrenName || "children";
    this.nodeName = param.nodeName || "name";
    this.simpleData = param.simpleData || false;
    this.showIcon = !!param.showIcon;

    // 请求
    this.url = param["url"];
    this.params = param.params || {};
    this.noneJSONParam = !!param.noneJSONParam; // 提交是的参数名称是否为不为json
    this.paramName = param.paramName || "json"; //如果nonjsonParam为true，则使用该参数指定的名称，如果为空或null，则不提供参数名称。
    this.async = !!param.async;

    // 事件
    this.onSelected = param.onSelected || function(){}; // 选择时的回调

    this.setting = param.setting || {
            async: {
                enable: _this.async,
                url:_this.url,
                autoParam:[_this.nodeIdName],
                otherParam:{"otherParam":"zTreeAsyncTest"}
            },
            view : {
                showIcon : _this.showIcon
            },
            callback: {
                onClick: function(e, treeId, node, flag){
                    _this.onSelected(node);
                }
            },
            data: {
                key: {
                    children: _this.childrenName,
                    name: _this.nodeName,
                    url:""
                },
                simpleData: {
                    enable: _this.simpleData,
                    idKey: _this.nodeIdName,
                    pIdKey: _this.parentIdName
                }
            }
        }; // ztree setting

    this.data = {};
    this.getNodeId = function (data) {
        return data[_this.nodeIdName]
    };
    this.getParentId = function (data) {
        return data[_this.parentIdName]
    };
    this.getChildren = function (data) {
        return data[_this.childrenName]
    };
    this.onSelected = param.onSelected || function () {
        }; // 选择时的回调

    //是否多选
    this.mutil = param["mutil"] ? true : false;

    this.setUrl = function (url) {
        this.url = url;
    };

    this.init = function () {
        _this.initModel();
    };

    this.initModel = function () {

        //如果不需要异步加载
        !_this.async && _this.load();
        _this.async && _this.asyncLoad();
    };

    /**设置参数**/
    this.setParam = function (param){
        for(var key in param ){
            _this.params[key] = param[key];
        }
        return this ;
    };

    this.asyncLoad = function(){
        $.fn.zTree.init($("#" + _this.id), _this.setting);
    }

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
            _this.zTreeObj = $.fn.zTree.init($("#" + _this.id), _this.setting, _this.data);
            _this.zTreeObj.expandAll(true);

            //回调
            callback &&　callback();
        });
    };

    this.clear = function(){
        $.fn.zTree.destroy(_this.id);
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
