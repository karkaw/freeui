/**
 * 配置控件的属性设置项插件
 *
 * @auther karka.w
 */
(function($) {
    var  fd = $.formdesign ;
    /**
     * init(props,src,div)
     * props --  fd.config 中的 配置项目
     *
     * src 在form-design 中控件
     *
     * FGroup 表示在.edit-form 中的.form-group
     */
    var setValue = function(id,key,value){
    	fd.props[id][key]["value"] = value ;
    };
    
    var getValue = function(id,key,props){
    	//初始值
        var value = null;
        if(fd.props[id][key]){
        	value = fd.props[id][key]["value"] ||   props[key].value ;
        }
        return value ;
    };
    
    $.extend(true, fd.plugins, {
        formEditor:function(){
            this.init = function(props,k,src,FGroup){
                var data = null ;
                $.post("../../wf/object/get.do",{},function(resText){
                    data = resText ;
                    var select =$("<select name='"+props[k].name+"' class='form-control'><option>请选择</option></select>");
                    for(var i = 0 ; i < data.length ; i++ ){
                        var option =$("<option value='"+data[i].code+"'>"+data[i].name+"</option>");
                        option.appendTo(select);
                    }
                    select.appendTo(FGroup);
                
	                select.bind("change",function(){
	                    fd.props.attrs.object = data[$(this).find(":selected").index()-1] || {};
	                    //src.data(k,$(this).val());
	                    fd.props.form[k].value = $(this).val() ;
	
	                    src.find(".form-name").text(fd.props.title||fd.props.attrs.object["name"]);
	                    src.find(".form-description").text(fd.props.headDesc||fd.props.attrs.object["description"]);
	                });
	
	                //初始值
	                FGroup.find("option[value='"+(fd.props.form[k].value|| props[k].value)+"']").prop("selected",true);
	                src.find(".form-name").text(fd.props.title||"标题");
	                src.find(".form-description").text(fd.props.headDesc||"标题描述");
	            });
            };
        },
        headTitleEditor:function(){
            this.init = function(props,k,src,FGroup){
                var text = $("<input type='text' class='form-control'/>");
                text.appendTo(FGroup);

                //绑定事件
                FGroup.delegate("input","keyup",function(){
                    $(".form-name",src).text($(this).val()||fd.props.attrs.object["name"]||"标题");
                    $("input[name='form_title']",src).val($(this).val()||fd.props.attrs.object["name"]||"标题");
                   // src.data(k,$(this).val());
                    fd.props.form[k].value = $(this).val() ;
                });
                var initValue = fd.props.form[k].value ;
                //返回值
                text.val( initValue || props[k].value);
                $("input[name='form_title']",src).val(fd.props.attrs.object["name"]||"标题");
            };
        },
        headDescEditor:function(){
            this.init = function(props,k,src,FGroup){

                var text = $("<textarea  class='form-control'></textarea>");
                text.appendTo(FGroup);

                //绑定事件
                FGroup.delegate("textarea","keyup",function(){
                    $(".form-description",src).text($(this).val()|| fd.props.attrs.object["description"]||"标题描述");
                    $("input[name='form_desc']",src).val($(this).val()||fd.props.attrs.object["description"]||"标题描述");
                    //src.data(k,$(this).val());
                    fd.props.form[k].value = $(this).val() ;
                });
                
                //返回值
                var initValue = fd.props.form[k].value ;
                text.val( initValue || props[k].value);
                $("input[name='form_desc']",src).val(fd.props.attrs.object["description"]||"标题描述");
            };
        },
        fieldEditor:function(){
            this.init = function(props,k,src,FGroup){
            	var id = src.attr("id"); //获取控件ID
            	
                var attrs = fd.props.attrs.object["attribute"];//主对象类型
                var type = props.filed.type || null ;		   //输入框类型
                if(attrs){
                    var select =$("<select class='form-control'><option>请选择</option></select>");
                    for(var i = 0 ; i < attrs.length ; i++ ){
                        var option =$("<option value='"+attrs[i].attrCode+"'>"+attrs[i].attrName+"</option>");

                        var attrCode = attrs[i].attrCode ;
                        var attrCodes = attrCode.split(fd.props.SP);
                        var ifList = false ;
                        for(var j = 0 ; j < attrs.length ; j++ ){
                            if(attrCodes.length >1){
                                var code = attrCode.substring(0,attrCode.lastIndexOf(fd.props.SP));
                                if(code == attrs[j].attrCode && attrs[j].attrType == "java.util.List"){
                                    ifList = true ;
                                    break ;
                                }
                            }
                        }
                        if(  ifList  ){
                            continue ;
                        }
                        if(type != null && type == attrs[i].attrType){ //过滤不匹配的字段类型
                            option.appendTo(select);
                        }else if(type == null){
                            option.appendTo(select);
                        }
                    }
                    select.appendTo(FGroup);
                    select.bind("change",function(){
                        var label = $(this).find(":selected").text();

                        //配置的选项--grid 列 checkbox ,slelect raido 是option
                        var option  = [] ;
                        for(var i= 0 ; i < attrs.length ; i++){
                            var attr = attrs[i] ;
                            var indexof =attr["attrCode"].indexOf($(this).val());
                            if(indexof == 0 && $(this).val() != attr["attrCode"]){
                                option.push(attr);
                            }
                        }

                        src.find("input,textarea,select").removeAttr("name").attr("name" ,$(this).val().replace(/-/g,"."));
                        src.find(".widget-title span:eq(0)").text(label);
                        //src.data("label",label);//--标题 attrName
                        
                        //src.data(k,$(this).val());//-- 组件name -- attrCode
                        fd.props.option= option;//-- 组件name -- attrCode
                        fd.props[id][k]["value"] = $(this).val() ;

                        try{
                            if(props.option){
                                props.option.editor().reload(props,k,src,FGroup,option);
                            }
                            if(props.control){
                                props.control.editor().reload(src);
                            }
                        }catch (e){
                        	console.log(e);
                        }
                    });

                    //初始值
                    var value = null;
                    if(fd.props[id][k]){
                    	value = fd.props[id][k]["value"] ||   props[k].value ;
                    }
                    FGroup.find("option[value='"+( value )+"']").prop("selected",true);
                }else{
                    alert("没有设置表单主对象类型");
                }

            };
        },
        labelEditor:function(){
            this.init = function(props,k,src,FGroup){
            	var id = src.attr("id"); //获取控件ID

                var text = $("<input type='text' class='form-control'/>");
                text.appendTo(FGroup);

                //绑定事件
                FGroup.delegate("input","keyup",function(){
                    $(".widget-title span:eq(0)",src).text($(this).val()||"文本输入框");
                    src.find("input").removeAttr("placeholder").attr("placeholder","请填写"+$(this).val());
                    //src.data(k,$(this).val());
                    
                    fd.props[id][k]["value"] = $(this).val() ;
                });
                //返回值
                text.val( getValue(id,k,props));
                src.find("input,textarea").removeAttr("placeholder").attr("placeholder","请填写"+ (text.val()||"文本输入框"));
            };
        },
        layoutEditor:function(radios){
            this.init  = function(props,k,src,FGroup){
            	var id = src.attr("id"); //获取控件ID

                var controls = $("<div class='controls'>");
                for(var i = 0 ; i < radios.length ;i++){
                    var radio  = $('<label class="radio-inline">' +
                        '       <input name="title-layout" type="radio" value="'+radios[i].value+'">'+radios[i].name+
                        '       </label>');
                    radio.appendTo(controls);
                }
                controls.appendTo(FGroup);

                //绑定事件
                FGroup.delegate("input:eq(0)","click",function(){
                    src.removeClass("field-hoz").addClass("field-hoz");
                    //src.data(k,radios[0].value);
                    
                    fd.props[id][k]["value"] = radios[0].value ;
                });
                FGroup.delegate("input:eq(1)","click",function(){
                    src.removeClass("field-hoz");
                    //src.data(k,radios[1].value);
                    
                    fd.props[id][k]["value"] = radios[1].value ;
                });

                controls.find("input[value="+( getValue(id,k,props) )+"]").prop("checked",true);
            };
        },
        descriptionEditor:function(){
            this.init  = function(props,k,src,FGroup){
            	var id = src.attr("id"); //获取控件ID

                var text = $("<input type='textarea' class='form-control'/>");
                text.appendTo(FGroup);

                //绑定事件
                FGroup.delegate("input","keyup",function(){
                    $(".field-description",src).text($(this).val());
                    if($(this).val() === ""){
                        $(".field-description",src).addClass("hide");
                    }else{
                        $(".field-description",src).removeClass("hide");
                    }
                    //src.data(k,$(this).val());

                    fd.props[id][k]["value"] = $(this).val();
                });

                //返回值
                text.val( getValue(id,k,props));
            };
        },
        requiredEditor:function(){
        this.init  = function(props,k,src,FGroup){
        	var id = src.attr("id"); //获取控件ID

            var controls = $("<div class='controls'>");

            var text = $('<input id="required" type="checkbox">这是一个必填项');
            text.appendTo(controls);
            controls.appendTo(FGroup);

            //绑定事件
            FGroup.delegate("input","click",function(){
                if(text.is(":checked")){
                    src.find(".required").text("*");
                }else{
                    src.find(".required").text("");
                }
                //src.data(k,text.is(":checked"));
                fd.props[id][k]["value"] = text.is(":checked");
            });

            //返回值
            text.prop("checked",getValue(id,k,props)) ;
        };
    },
    sizeEditor:function(radios){
        this.init  = function(props,k,src,FGroup){
        	var id = src.attr("id"); //获取控件ID

            var controls = $("<div class='controls'>");
            for(var i = 0 ; i < radios.length ;i++){
                var radio  = $('<label class="radio-inline">' +
                    '       <input name="control-size" type="radio" value="'+radios[i].value+'">'
                    +radios[i].name+
                    '       </label>');
                radio.appendTo(controls);
            }
            controls.appendTo(FGroup);

            //绑定事件
            FGroup.delegate("input","click",function(){
                src.find(".form-control").removeClass("small")
                                        .removeClass("medium")
                                        .removeClass("large").addClass($(this).val());
                // src.data(k,$(this).val());
                fd.props[id][k]["value"] = $(this).val();
            });

            //返回值
            controls.find("input[name=control-size][value="+(src.data(k)|| props[k].value )+"]").prop("checked",true);
            src.find(".form-control").removeClass("small").removeClass("medium")
                .removeClass("large").addClass(getValue(id,k,props));
        };
    },
    optionEditor:function(){
        var  _this = this ;
        this.options = [] ;
        this.init = function(props,k,src,FGroup){
        	var id = src.attr("id"); //获取控件ID
        	
            _this.options = fd.props.option || [{attrName:"选项1",attrCode:"op1"},
                {attrName:"选项2",attrCode:"op2"},
                {attrName:"选项3",attrCode:"op3"}] ;

            var controls = $("<div class='controls option'></div>");
            for(var i = 0 ;i <_this.options.length ;  i++){
                var option = _this.options[i];
                var line = $("<div><input type='checkbox' > <select><option>请选择</option></select></div>") ;
                for(var j = 0 ;j <_this.options.length ;  j++){
                    var opt = $("<option value='"+_this.options[j].attrCode+"'>"+_this.options[j].attrName+"</option>");
                    opt.appendTo(line.find("select"));
                }
                line.appendTo(controls);
            }
            controls.appendTo(FGroup);

            FGroup.appendTo(fd.builder.ele) ;
        } ;
        this.reload = function(props,k,src,FGroup ){
            //显示控件属性值
            $("#"+fd.builder.editAttr).find(".option").empty();

            _this.options = fd.props.option || [{attrName:"选项1",attrCode:"op1"},
                                                                {attrName:"选项2",attrCode:"op2"},
                                                                {attrName:"选项3",attrCode:"op3"}] ;
            _this.init(props,k,src, $("#"+fd.builder.editAttr).find(".option"));
        };

    }

    });
})(jQuery);