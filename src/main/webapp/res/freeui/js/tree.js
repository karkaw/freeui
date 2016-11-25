/**
 * 接受的参数
 * @param param
 * ｛
 * id : 树元素
 * URL ：获取数据的URL
 * treeid :节点ID
 * root ：是否默认根节点
 * rootLable ：根节点的名称 和 root 一起使用
 * label :  data【label】 显示树的名称
 * value :  data【value】 显示树的值
 * leaf :    data【leaf】 是否叶子节点的
 * .......
 *
 * #--------事件----------------
 *
 * onSelect()
 *
 *
 * ==========函数===========
 *getSelectValues() 获取被选中的数据
 * 		mutli :是否多选
 *
 *
 * ｝
 * @constructor
 */

UI.Tree = function (param) {

    var _this = this ;

    this.id = param["id"] ;

    this.ele = null ;

    this.url = param["url"];

    this.treeid = param["treeid"] || '';
    this.onSelected = param.onSelected || function(){};
    this.onAddCheckbox = param.onAddCheckbox || function(){};

    this.root = param["root"] ||  false ;

    this.rootLable = param["rootLable"] || '根节点' ;

    this.isLeaf = param["isLeaf"] || "isLeaf" ;

    this.data = {} ;

    this.label = param["label"] || 'name' ;

    this.selectValue = [] ;

    this.mutil = true ;
    this.params = {}

    /**树的单击事件接口**/
    this.nodeClick =   function(treeid){

    } ;

    UI.apply(this,param);

    this.addTreeNode = function(obj,treeid){

        _this.appenNode(obj,treeid)

    }

    this.reload = function(){
        $("#" + this.id).find("ul:first").remove();
        _this.init();
    }

    //初始化，查看是否有UL
    this.init = function(){
        var _this = this ;
        _this.ele = $("#"+this.id) ;

        var pele = $("#"+this.id) ;
        var ul ;
        if($("#" + this.id).find("ul:first").length >0 ) {
            ul =  $(pele).find("ul:first");
        }else{
            ul = $("<ul></ul>");
            ul.prependTo(pele) ;
        }
        ul.attr("root",true);
        if(!_this.root){
            this.appendChild(pele,{})
        }else{
            this.createNode(ul,{})
        }
    };

    //加载数据
    this.load = function(treeid){
        var params = $.extend({id:treeid}, _this.params);
        var _data = {};
        $.post(this.url,params,function(data){
            _data = data ;
        });
        return _data ;
    }

    this.appenNode = function(obj,treeid){

        var ele = treeid ? $("span[treeid='"+treeid+"']"): $("#"+this.id);
        var ul ;
        if(ele.next("ul").length > 0){
            ul =  ele.next("ul:first")
        }  else if(ele.find("ul:first").length >0 ) {
            ul =  ele.find("ul:first")
        }else{
            ul = $("<ul></ul>");
            ul.insertAfter(ele) ;
        }

        _this.createNode(ul,obj);

    }

    //创建父节点
    this.createNode = function(_ele,_obj){
        var label  = _obj[this.label] || this.rootLable;
        var isLeaf = _obj[this.isLeaf]  || false ;
        var isRoot = _ele.attr("root") ? true : false ;
        var li = $("<li></li>");
        li.addClass("parent_li");

        var clazz ;
        if(isRoot){
            clazz = isRoot ? "icon-folder-open" : "icon-minus-sign" ;
        }else if(isLeaf){
            clazz =  "icon-leaf" ;
        }else{
            clazz =  "icon-minus-sign" ;
        }

        var span = $('<span></span>') ;
        span.data("data",_obj);
        if(_this.mutil){
            var select = $("<input type='checkbox'>");
            _this.onAddCheckbox(select, _obj);
            select.appendTo(span);
        }else{
            var icon = $('<i class="'+clazz+'"></i> ');
            icon.appendTo(span);
        }

        span.append(label);
        span.attr({"treeid":_obj[_this.treeid]});
        span.appendTo(li);
        li.appendTo(_ele) ;

        span.mousedown(function(event, a){
            if(event.which == 3 || a == 'right'){
                //_this.mouseRightEvent(event);
                event.stopPropagation();
            }
        });

        span.bind("dblclick",function(event){
           if(isLeaf) event.stopPropagation(); //如果是叶子节点
           // if($(this).attr("open")){         //如果已经展开
           //     $(this).next("ul").hide();
           //     $(this).attr("open",false);
           //     $(this).find("i").removeClass("icon-minus-sign").addClass("icon-plus-sign");
           // }else{
           //     $(this).next("ul").show();
           //     $(this).attr("open",true);
           //     $(this).find("i").removeClass("icon-plus-sign").addClass("icon-minus-sign");
           // }
           // var treeid = $(this).attr("treeid") || '' ;
           // _this.appendChild($(this),treeid) ;
            var treeid = $(this).attr("treeid") || '' ;

            $(_this.ele).find("span").css({'background-color':'#eee'});
            var  isSelect = $(this).attr("select");
            if(isSelect && isSelect == "true"){
                $(this).attr("select","false");
                $(this).css({'background-color':'#eee'});
                //$(this).find("input").prop("checked",false);
            }else{
                $(_this.ele).find("span").attr("select","false");
                $(this).attr("select","true");
                //$(this).find("input").prop("checked",true);
                if(!_this.mutil){
                    _this.selectValue = [] ;
                    _this.selectValue.push( $(this).data("data"));
                    _this.onSelected(_this.getSelectValues()[0]);
                }
            }
            $(this).css({'background-color':'#D2D2D2'});

            _this.nodeClick(treeid);

            event.stopPropagation();

        });
        /**树的单击事件**/
        span.bind("click",function(event){
            //var treeid = $(this).attr("treeid") || '' ;
            //
            //$(_this.ele).find("span").css({'background-color':'#eee'});
            //var  isSelect = $(this).attr("select");
            //if(isSelect && isSelect == "true"){
            //    $(this).attr("select","false");
            //    $(this).css({'background-color':'#eee'});
            //    //$(this).find("input").prop("checked",false);
            //}else{
            //    $(_this.ele).find("span").attr("select","false");
            //    $(this).attr("select","true");
            //    //$(this).find("input").prop("checked",true);
            //    if(!_this.mutil){
            //        _this.selectValue = [] ;
            //        _this.selectValue.push( $(this).data("data"));
            //    }
            //}
            //$(this).css({'background-color':'#D2D2D2'});
            //
            //_this.nodeClick(treeid);
            //
            //event.stopPropagation();
            if($(this).attr("open")){         //如果已经展开
                $(this).next("ul").hide();
                $(this).attr("open",false);
                $(this).find("i").removeClass("icon-minus-sign").addClass("icon-plus-sign");
            }else{
                $(this).next("ul").show();
                $(this).attr("open",true);
                $(this).find("i").removeClass("icon-plus-sign").addClass("icon-minus-sign");
            }
            var treeid = $(this).attr("treeid") || '' ;
            _this.appendChild($(this),treeid) ;
            event.stopPropagation();
        });
    }

    this.getSelectValues = function () {
        if(_this.mutil){
            _this.selectValue = [] ;
            var selects = _this.ele.find("input:checked")
             for(var i = 0 ; i<selects.length ; i++){
                 _this.selectValue.push($(selects[i]).parent().data("data"));
             }
        }
        return _this.selectValue ;
    }

    //追加子节点
    this.appendChild = function(el,treeid){
        var ul ;
        if(el.next("ul").length > 0){
           ul =  el.next("ul:first")
        }  else if(el.find("ul:first").length >0 ) {
            ul =  el.find("ul:first")
        }else{
            ul = $("<ul></ul>");
            ul.insertAfter(el) ;
        }

        if( ul.attr("load")){
            return ;
        }
        var params = $.extend({id:treeid}, _this.params);
        $.post(_this.url,params,function(data){
            for(var i = 0; i<data.length ;i++){
                var obj = data[i] ;
                _this.createNode(ul,obj);
            }
            ul.attr("load",true);
        });

    };

    this.removeNode = function(treeid){
        var ele = treeid ? $("span[treeid='"+treeid+"']"): $("#"+this.id).find("ul");
        ele.remove();
    }

    /**设置右键点击事件**/
    this.setMouseRightEvent = function(func){
        _this.mouseRightEvent  = func ;
    }
    this.init();
}