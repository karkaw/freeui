/**
 * 拖动创建控件类
 * 
 * @auther karka.w
 */

(function ($){

    var FD = {};

    //表单配置参数
    FD.config ={form:{},text:{},textarea:{},radio:{},select:{},
    			checkbox:{},date:{},user:{},org:{},grid:{}};

    //表单属性插件
    FD.plugins ={};

    //表单控件,复杂表单控件,grid
    FD.control ={};

    //表单及属性配置项
    FD.props = {
    	attrs:{object:{name:null,description:null}},
    	option:null,
    	index:0,//表单ID标记
    	SP:"-", //表单名称分隔符，例如：user_name
    	form:{
    		type:"text",
    		object:{
    			value:""
    		},
    		title:{
    			value:""
    		},
    		headDesc:{
    			value:""
    		}
    	},	
    	field1:{
    		    		
    	}	 
    };

  //控件的映射,过滤对象属性和控件类型不匹配属性。
    FD.mappper ={ 
        string : "java.lang.String",
        file:"java.io.File",
        data:"java.util.Date",
        grid  :"java.util.List"
    };

    /**
     * @type object: {} -- 主对象类型
     */
    //FD.attrs = {object:{}};

    /**根据config 生成设置项**/
    FD.builder = {

        /**
         *src 在form-design 中控件
         *
         * type 控件的类型，text , radio .....
        **/
        editAttr : "editor-component" ,
        init:function(control,type){

            var _this = this ;

            this.ele = $("#"+FD.builder.editAttr);
            
            var element =  FD.config[type];

            var flag = false;

            var index = FD.props.index++ ;
            if(control == null){
                control = $("#"+type).clone();
                //标记控件编码
                control.attr("id","field"+ index);
                FD.props["field"+index] = {} ; //
                FD.props["field"+index]["type"] = type ; //
                flag = true ;
            }
            
            //存储控件类型
            //清除
            _this.clear();

            for(var key in element){
            	
            	if(flag){
            		FD.props["field"+index][key] = {} ;
            	}
            	
                if(key =="desc"){
                    //显示控件描述
                    _this.desc(element.desc || "");
                }else if(key == "control" && control != null){
                    var field  =  element.control.editor().init(control);
                    var widgetContent = control.find(".widget-content div:eq(1)");
                    widgetContent.empty();
                    field.appendTo(widgetContent);
                }else{
                    //显示控件属性值
                    var formGroup = $('<div class="form-group"></div> ');
                    var label = $("<label/>");
                    label.text(element[key]["text"]);
                    label.appendTo(formGroup);

                    /**
                     * element -- fd.config.*
                     *
                     * key  -- fd.config.*.*
                     *
                     * control -- 编辑控件
                     *
                     * formGroup -- 属性配置
                     *
                     */
                    element[key].editor().init(element,key,control ,formGroup);
                    formGroup.appendTo(_this.ele);
                }
            }
            return control;
        },
        build:function(props){
        	var _this = this ;
        	
        	$("#editView").html(props.content);
        	
        	
        },
        desc :function(description){
            var _this = this ;

            var descDiv = $('<div class="alert alert-success edit-tips cs-h">'+
                '    <h5>控件使用说明</h5>'+
                '    <div class="hide">'+description+'</div>'+
                '</div>');

            descDiv.appendTo(_this.ele);
            $(".edit-tips").bind("mouseenter",function(){
                $(this).find("div:eq(0)").removeClass("hide");
            });
            $(".edit-tips").bind("mouseleave",function(){
                $(this).find("div:eq(0)").addClass("hide");
            });

        },
        clear : function(){
            var _this = this ;
            _this.ele.empty();
        }
    };
    $.formdesign = FD ;
})(jQuery);

$(function(){
    //被选中的cell
    var selectCell = null ;
    //标记控件编码
    $(".widget-item").each(function (idx, ele) {
        var size =  1 ;
        var type = "" ;
        var X = 0;
        var Y = 0;
        var DX = 0;
        var DY = 0;

        $(ele).bind('mousedown', function (MDEvent) {
            var _this = this ;
            size = parseInt($(_this).attr("col")) || 1;
            type = $(_this).attr("type");
            var $target = $("#widget-control .columns_js");

            var drag = $("<div></div>");
            var place = $("<div class='form-placeholder-filed'>放在这里</div>");

            drag.text($(_this).text());
            drag.appendTo("body");

            X = $(_this).offset().left;
            Y = $(_this).offset().top;

            var tops ;

            drag.css({ cursor: 'move', position: 'absolute', left: X, top: Y});
            $(document).bind('mousemove', function (MMEvent) {
                DX = MMEvent.pageX;
                DY = MMEvent.pageY;
                drag.css({ position: 'absolute', left: DX, top: DY});

                tops = $.grep($target, function(num){
                    return ($(num).position().top - DY + (place.height()/2)  > 0 );
                });

                if(type =="layout"){
                    if(tops.length >0){
                        place.insertBefore(tops[0]);
                    }else{
                        place.appendTo("#widget-control");
                    }
                }
            });
            $(document).bind('mouseup', function (MUEvent) {

                var  rowstr =  "<div class='form-layout columns_js'>" +
                            "   <div class='column-layout columns-"+size+"'>" ;
                for(var i= 0 ; i<size ; i++){
                    rowstr +="<div class='cell'></div>" ;
                }
                rowstr +="</div>" ;
                if(size>1){
                    rowstr += '<div class="form-layout-toolbar">'+
                        '     <span class="j_layoutDele layoutDele-btn j_cancel-drag"><i class="icon-trash"></i>删除</span>'+
                        '</div> ';
                }
                rowstr +="</div>" ;
                var row = $(rowstr);
                row.find(".layoutDele-btn").bind("click",function(){
                    $(this).parent().parent().remove();
                });
                if(type =="layout"){
                    row.replaceAll(place);
                }else{
                    var control =  $.formdesign.builder.init(null,type);

                    control.find(".widgetDele-btn").bind("click",function(){
                        if($(this).parent().parent().length < 2){
                            $(this).parent().parent().parent().parent().remove();
                        }else{
                            $(this).parent().remove();
                        }
                        selectCell = null ;
                    });

                    if(selectCell !=null){
                        selectCell.empty();
                        control.appendTo(selectCell);
                        control.show();
                        selectCell.find(".field").addClass("field-active");
                    }else{
                        control.appendTo(row.find(".cell"));
                        control.show();
                        row.appendTo("#widget-control");
                    }
                }

                drag.remove();
                $(document).unbind('mousemove');
                $(document).unbind('mouseup');

            });
        });


    });

    $("#widget-control").delegate(".cell","mouseenter",function(){
        $(this).css({ border:"1px dashed #DB4040"});
        selectCell= $(this) ;
    });

    $("#widget-control").delegate(".cell","click",function(CEvent){
        $(".field").removeClass("field-active");
        $(this).find(".field").addClass("field-active");
        var control =  $(this).find(".field");
        
        var id = control.attr("id");
        if(control.html() == ""){
            $.formdesign.builder.clear();
        }else{
            $.formdesign.builder.init(control,$.formdesign.props[id]["type"]);
        }
        CEvent.stopPropagation();
    });

    $("#widget-control").delegate(".cell","mouseleave",function(){
        $(this).css({borderStyle:"none",borderLeft:"1px solid #7FCDFD"});
        selectCell = null ;
    });

    //编辑区域添加点击时编辑表头
    $("#editView").bind("click",function(){
        $.formdesign.builder.init($(this),"form");
    });

    //初始化表头
    $.formdesign.builder.init($(this),"form");
});