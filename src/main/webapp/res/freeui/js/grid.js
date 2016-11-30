UI.Grid =  function(params){
    var _this = this ;

    this.id  =  params["id"] || "grid" ;

    this.url  =  params["url"] || "list.do" ;

    this.params= {} ;
    this.datatype = params.datatype || 'json' // 提交是的参数名称是否为不为json

    this.paramName = params.paramName || "json"; //如果nonjsonParam为true，则使用该参数指定的名称，如果为空或null，则不提供参数名称。

    this.data ={}  ;

    this.hasNoPageTool = !!params.hasNoPageTool;

    //当前页数
    this.index = 1 ;
    //每页大小
    this.limit = 10 ;
    //总条数
    this.size = -1;
    //总页数
    this.count= -1;

    //是否多选
    this.mutil = params["mutil"] ? true :false ;

    //排序列
    this.orderIndex = null;

    //排序
    this.order = "";

    this.orderby = "";

    //排序
    this.sort = {} ;

    this.setUrl = function(url){
        this.url = url;
    };

    this.init = function(){
        _this.initEvent();
        _this.initModel();
    };

    this.initModel = function(){
        //根据屏幕大小隐藏列
        $("#"+_this.id + "_thead").find("thead > tr > th").each(function(idx){

        });

        $("#"+_this.id).find("tbody > tr > td").each(function(id){

        });

        //table变化时调整列宽度
        this.resizeTable();
    };

    this.initEvent = function(){
        //分页事件
        $("#"+_this.id+"_page").find('input:text').on('keydown', function (event) {
            if (event.keyCode == 13) {
                _this.to($(this).val());
            }
        });

        //每页事件
        $("#"+_this.id+"_page").find('select').on('change', function (event) {
            _this.setPageSize($(this).val());
        });

        //全选，反选
        $("#"+_this.id + "_thead").find('input:checkbox').bind("click",function(event){
            var flag = this.checked ;
            $("#"+_this.id).find('input:checkbox').each(function(idx,el){
                el.checked = !flag ;
                $(el).click();
            });
        });

        //排序
        $("#"+_this.id + "_thead").find("thead > tr > th").each(function(idx,th){
            if ( $(this).attr('order') == 'true') {
                $(this).on('click',function(){
                    _this.orderIndex = $(th).index();
                    _this.orderby =  $(th).attr('name') ;
                    _this.order =  $(th).find('.sort').hasClass('sort-gray') || $(th).find('.sort').hasClass('sort-desc') ? "asc" : "desc";
                    _this.reload();
                });
            }
        });

    };

    /**设置参数**/
    this.setParam = function (param){
        for(var key in param ){
            _this.params[key] = param[key];
        }
        return this ;
    };

    this.resizeTable = function(){
        $("#"+_this.id+"_thead").find("th").each(function(idx,el){
            var th = $(el);
            var tds = $("#"+_this.id+" tbody > tr").eq(0).find("td").eq(idx);
            tds.css({width:th.outerWidth()});
        });
    };

    this.load = function(params, callback){//从服务器获取数据
        _this.params = params || {};
        _this.params['pageNum'] = _this.index;
        _this.params['pageSize'] = _this.limit;
        if (_this.orderby != null  && _this.orderby != '') {
            var sort = {};
            sort[_this.orderby] = _this.order == "asc"?1:-1;
            _this.params["sort"] =sort ;
        }

        var leader = new  UI.ajax({url:_this.url,data:_this.params, datatype : _this.datatype, paramName : this.paramName});
        leader.load(function(data){
            if(!data){
                return;
            }
            if(data.msgType && $.trim(data.msgType) != ""){
                _this.data =  data.result || {};
                //当前选中的页数
                _this.index = _this.data.pageNum || 1 ;
                //总的页数
                _this.count = _this.data.totalPage || _this.data.pages || 1;
                //总的条数
                _this.size = _this.data.totalCount || _this.data.total || _this.data.length || 0;
                if( data.msgType == 'page'){//判断是否分页,如果不是显示所有的数据
                    _this.data = _this.data.result || _this.data.list || [];
                }
            }else{ //数据不是返回jsonResult对象时，直接返回集合
                _this.data =  data || [] ;
                _this.size = _this.data.length;
                _this.count = 1;
                _this.index = 1;
            }
            _this.fill();
            _this.markOrder();
            _this.page();
            callback &&　callback();
        });
    };

    this.clear = function(){
        var tby = $("#" + _this.id).find("tbody");
        tby.find("tr").each(function(idx,el){
            if(idx==0) {
                $(el).css("display","none");
                return;
            }
            $(this).remove();
        });
        _this.data = {};
        _this.index = 1 ;
        _this.size = -1;
        _this.count= -1;
        _this.page();
    };

    //填充数据
     this.fill = function(){//填充grid数据
        var tby = $("#" + _this.id).find("tbody");

        //删除之前的TR
        tby.find("tr:gt(0)").each(function(){
             $(this).remove();
         });

        for (var i = 0; i < _this.data.length; i++) {

            var tr = _this.addRow(i);

            var tds = tr.find("td");
            for(var ti = 0; ti< tds.length; ti++) {//填充数据
                var td = tds[ti];
                var name = $(td).attr('name');
                if(name) {
                    var name_method = name.split('?');
                    name = name_method[0];
                    var method = name_method.length==2?name_method[1]:null;
                    var nps = name.split('.');
                    var value = _this.data[i];
                    for(var ni = 0; ni < nps.length; ni++) {
                        if(!value)break;
                        value = value[nps[ni]];
                    }

                    //系统加载数据格式化函数
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

                //自定义列的函数
                var onload = $(td).attr('onload');
                if(onload && typeof window[onload] == 'function') {
                    window[onload].call(td, _this.data[i]);
                    continue;
                }
            }
        }
    };



    //动态添加行
    this.addRow = function (index) {
        var tby = $("#" +_this.id).find("tbody");
        var tr = tby.find("tr:first");
        //默认取消多选的事件
        tr.find("input:checkbox,input:radio").unbind("click").bind('click',function(e){

        });
        var otr =  tr.clone(true);

        //替换一行中所有的#[]格式的字符串为具体的值
        var _old = otr.html();
        var reg5 = /#\[(.+?)\]/g; //匹配需要替换的字符串
        var m = _old.match(reg5);
        if(m){
            var resultList = UI.unique(m);  //数组去重
            for (var i=0;i<resultList.length;i++){
                var result = resultList[i];
                var key = result.substr(2,result.length-3);
                var re = new RegExp("#\\["+key+"\\]",'g');
                _old = _old.replace(re,  _this.data[index][key] || "");
            }
        }

        otr.empty().append($(_old));
        otr.show();
        otr.appendTo(tby);


        //选择一行的样式
        var select = otr.find("input:checkbox,input:radio");
        select.unbind("click").bind('click', function () {
            var _idx = $(this).parent().parent("tr").index() ;
            _this.selection = _this.data[_idx-1] || null;

            if(!_this.mutil){//如果是单选
                $("#"+_this.id).find("input:checkbox,input:radio").each(function(idx){
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
        return otr;
    };

    this.markOrder = function () {
        if (_this.orderby == null || _this.orderby == '') {
            return;
        }
        var headerId = _this.id + "_thead" ;
        var ths = $("#" + headerId).find("thead > tr > th");
        ths.find('.sort').addClass('sort-gray').removeClass('sort-asc').removeClass('sort-desc');
        var th = $("#" +headerId).find("thead > tr > th:eq(" + _this.orderIndex + ")");
        th.find('.sort').removeClass('sort-gray').addClass("sort-" + this.order);
    };

    this.changePageSize = function(select) {
        var size = $(select).val();
        if(size && !isNaN(size)) {
            _this.limit = parseInt(size);
            _this.reload();
        }
    }

    this.initPage = function(){ //初始化分页控件

        if(_this.hasNoPageTool) {
            return;
        }

        var pdiv = $("<div class='widget-foot'></div>");
        pdiv.attr("id",_this.id+'_page');
        pdiv.insertAfter($("#"+_this.id).parent());

        var zdiv = $('<div class="pagination pull-right" style="margin: -5px 5px -1px 5px ;"></div>');
        var select = $('<select onchange="UI.get(\'' + _this.id + '\').changePageSize(this)"><option>10</option><option>20</option><option>30</option></select>');
        select.css({height:'30px',width:'50px','border':'1px solid #ddd'});
        select.appendTo(zdiv);
        zdiv.appendTo(pdiv);

        var plul = $('<ul class="pagination pull-right" style="margin: -7px 5px -1px 5px ;"></ul>');
        plul.appendTo(pdiv);

        var nli = $('<li onclick="UI.get(\'' + _this.id + '\').to(\'next\')"><a href="#">></a></li>');
        var eli = $('<li onclick="UI.get(\'' + _this.id + '\').to(\'last\')"><a href="#">&raquo;</a></li>');
        nli.appendTo(plul);
        eli.appendTo(plul);

        var zdiv = $('<div class="pagination pull-right" style="margin: -5px 5px -1px 5px ;">第 <input/> 页</div>');
        zdiv.find("input").css({height:'30px',width:'40px','border':'1px solid #ddd','text-align':'center'});
        zdiv.appendTo(pdiv);

        var pnul = $('<ul class="pagination pull-right" style="margin: -7px 5px -1px 5px ;"></ul>');
        pnul.appendTo(pdiv);

        var fli = $('<li onclick="UI.get(\'' + _this.id + '\').to(\'first\')"><a href="#">&laquo;</a></li>');
        var lli = $('<li onclick="UI.get(\'' + _this.id + '\').to(\'previous\')"><a href="#"><</a></li>');
        fli.appendTo(pnul);
        lli.appendTo(pnul);

        var pspan = $('<p style="margin: 8px;">第<span>0</span>/<span>0</span>页，共<span>0</span>条</p>');
        pspan.appendTo(pdiv);
    };

    this.page=function(){

        if(_this.hasNoPageTool) {
            return;
        }

        var page = $("#"+_this.id+"_page");
        page.find('p > span:eq(0)').empty().html(_this.index);
        page.find('p > span:eq(1)').empty().html(_this.count );
        page.find('p > span:eq(2)').empty().html(_this.size);

        page.find('li:eq(0)').removeClass('disabled');
        page.find('li:eq(1)').removeClass('disabled');
        page.find('input:text').val(_this.index);
        page.find('li:eq(2)').removeClass('disabled');
        page.find('li:eq(3)').removeClass('disabled');
        if (_this.index == _this.count) {
            page.find('li:eq(0)').addClass('disabled');
            page.find('li:eq(1)').addClass('disabled');
        }
        if (_this.index == 1) {
            page.find('li:eq(2)').addClass('disabled');
            page.find('li:eq(3)').addClass('disabled');
        }
    };

    this.to = function(param){

        if (typeof param == 'string') {
            if (param === 'first') {
                _this.index = 1 ;
            }else if (param === 'last') {
                _this.index = _this.count ;
            }else if (param === 'previous') {
                _this.index  -= 1 ;
                if(_this.index <0)  _this.index = 1 ;
            }else if (param === 'next') {
                _this.index  += 1 ;
                if( _this.index > _this.count ) 	_this.index = _this.count  ;
            }else{
                _this.index = param ;
            }
        }

        _this.load(_this.params);
    };

    this.setPageSize=function(pageSize){
        pageSize = parseInt(pageSize);
        if (pageSize != 'NaN') {
            _this.limit = pageSize;
            _this.load(_this.params);
        }
    };


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
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     *  获取多选checkbox值,mutil--是否多选
     *
     *  返回id的数组
     */

    this.getSelectValues = function (mutil) {
        var values = [];
        var td = $("#" + _this.id).find("tbody > tr:gt(0) td");
        var checked = td.find('input:checkbox:checked,input:radio:checked');
        if(_this.getSelectedCount()==0){
            $.gritter.add({
                title: '提示信息',
                text:  "没有选中的数据！",
                class_name: 'gritter-error'
            });
            return null;
        }
        if(!mutil && _this.getSelectedCount()>1){
            $.gritter.add({
                title: '提示信息',
                text:  "只能选择一条数据！",
                class_name: 'gritter-error'
            });
            return null;
        }
        checked.each(function (idx, checkbox) {
            values.push($(checkbox).val());
        });
        return values;
    };

    /**
     * 获取选中的行数
     * 行的数量
     */
    this.getSelectedCount = function(){
        var td = $("#" + _this.id).find("tbody > tr > td");
        var checked = td.find('input:checkbox:checked,input:radio:checked');
        return checked.length;
    }

    /**
     *获取选择的行数据
     */
    this.getSelection = function () {
        if(_this.getSelectedCount()>1){
            $.gritter.add({
                title: '提示信息',
                text:  "只能选择一条数据！",
                class_name: 'gritter-error'
            });
            return null;
        }
        return _this.selection;
    };

    this.removeRowById = function(ids){
        for(var i = 0 ; i < ids.length ; i++){
            $("#" + _this.id + " tr td input[type=checkbox][value="+ids[i]+"]").parent().parent().remove();
        }
    };

    this.init();

    /***************************格式化器*********************************/
        //格式化金额，返回格式如：10.01、10.00
    this.currency = function(num) {
        num = num.toString().replace(/\$|\,/g,'');
        if(isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
            num = num.substring(0,num.length-(4*i+3))+','+
                num.substring(num.length-(4*i+3));
        return (((sign)?'':'-') + num + '.' + cents);
    }
};