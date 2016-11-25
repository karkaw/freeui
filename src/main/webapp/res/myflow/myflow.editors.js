(function($){
var myflow = $.myflow;

$.extend(true, myflow.editors, {
	inputEditor : function(){
		var _props,_k,_div,_src,_r;
		this.init = function(props, k, div, src, r){
			_props=props; _k=k; _div=div; _src=src; _r=r;

			$('<input style="width:100%;"/>').val(props[_k].value).change(function(){
				props[_k].value = $(this).val();
			}).appendTo('#'+_div);
			
			$('#'+_div).data('editor', this);
		}
		this.destroy = function(){
			$('#'+_div+' input').each(function(){
				_props[_k].value = $(this).val();
			});
		}
	},
	selectEditor : function(arg,label,value,change){
        var _this = this ;
        var _label = label || "name" ;
        var _value = value || "value" ;

		var _props,_k,_div,_src,_r;
		this.init = function(props, k, div, src, r){
			_props=props; _k=k; _div=div; _src=src; _r=r;

			var sle = $('<select  style="width:100%;" id=e'+k+'/>' ).val(props[_k].value).change(function(){
				props[_k].value = $(this).val();
			}).appendTo('#'+_div);

			if(typeof arg === 'string'){
				$.ajax({
				   type: "POST",
				   url: arg,
				   success: function(data){
					  var opts = eval(data);
			            if(opts && opts.length){
                            for(var idx=0; idx<opts.length; idx++){
                                sle.append('<option value="'+opts[idx][_value]+'">'+opts[idx][_label]+'</option>');
                            }
                            sle.val(_props[_k].value);

                            if(_props[_k].value == "" ){
                                if(_k == "ocode"){
                                    sle.val($.ocode.value);
                                    $.ocode.value = sle.val();

                                }
                            }
					 }
				   }
				});
			}else {
				for(var idx=0; idx<arg.length; idx++){
					sle.append('<option value="'+arg[idx][_value]+'">'+arg[idx][_label]+'</option>');
				}
				sle.val(_props[_k].value);
			}

            if(_k == "ocode"){
                sle.bind("change",function(){
                    if(change) {
                        $.ocode.value = _props[_k].value;
                    }
                    $(".prop-pop").remove();
                });
            }

			$('#'+_div).data('editor', this);
		};
		this.destroy = function(){
			$('#'+_div+' input').each(function(){
				_props[_k].value = $(this).val();
			});
		};
	},
    enterEditor:function(){
        var _this = this ;
        var _props,_k,_div,_src,_r;
        this.init = function(props, k, div, src, r){
            _props=props; _k=k; _div=div; _src=src; _r=r;

            var propEditer = $("#propEditer").clone(true);
            propEditer.appendTo('#'+_div);
            propEditer.show();
            propEditer.unbind("click").bind("click",function(e){

                $(".prop-pop").remove();

                var enterProp = $("#enterPropDiv").clone(true);
                enterProp.addClass("prop-pop");

                enterProp.appendTo('#'+_div);
                enterProp.show();

                enterProp.find("table thead tr:first th img").bind("click",function(){
                    _this.destroy();
                    enterProp.remove();
                });

                enterProp.find("table tbody tr:first td:eq(0)").bind("click",function(){
                    $(this).parent().remove();
                });

                enterProp.find(".panel-add-btn").bind("click",function(e){
                    var tr = enterProp.find("table tbody tr:first").clone(true);
                    tr.appendTo($(this).prev("table"));
                    tr.show();
                });

                var ocode = $("#eocode").val() || $.ocode.value;
                if(ocode){
                    $.post("../../wf/object/getAttr.do",{json:JSON.stringify({code:ocode})},function(data) {
                        for(var i =  0 ; i < data.length ; i++){
                            var option = $("<option/>");
                            option.val(data[i]["attrCode"]);
                            option.text(data[i]["attrName"]);
                            option.appendTo("#enterProp tbody tr:eq(0) select[name=propName]");
                        }

                        var enterArr =  _props[_k].value || [];
                        $("#enterProp tbody tr:gt(0)").remove() ;
                        for(var i  = 0 ; i < enterArr.length ; i++){
                            var enter = enterArr [i] ;
                            var tr = enterProp.find("table tbody tr:first").clone(true);
                            for(var k in  enter){
                                $("*[name="+ k +"]",tr).val(enter[k]);
                            }
                            tr.appendTo(enterProp.find("table tbody"));
                            tr.show();
                        }
                    });
                }
            });

            $('#'+_div).data('editor', this);
        }

        this.destroy = function(){
            var tr = $("#enterProp tbody tr:gt(0)") ;
            if(tr.length < 1){
                return ;
            }
            var arr = [] ;
            for(var i  = 0 ; i < tr.length ; i++){
                var attr = {};
                $("select,input",tr[i]).each(function(idx , ele){
                    attr[$(ele).attr("name")] = $(ele).val();
                });
                arr.push(attr);
            }
            _props[_k].value = arr;
        }
    },
    initOperEdit: function(){
        var _this = this ;
        var _props,_k,_div,_src,_r;
        this.init = function(props, k, div, src, r){
            _props=props; _k=k; _div=div; _src=src; _r=r;

            var propEditer = $("#propEditer").clone(true);
            propEditer.appendTo('#'+_div);
            propEditer.show();
            propEditer.unbind("click").bind("click",function(e){

                $(".prop-pop").remove();

                var initProp = $("#initPropDiv").clone(true);
                initProp.addClass("prop-pop");

                initProp.appendTo('#'+_div);
                initProp.show();

                initProp.find("table thead tr:first th img").bind("click",function(){
                    _this.destroy();
                    initProp.remove();
                });

                initProp.find("table tbody tr:first td:eq(0)").bind("click",function(){
                    $(this).parent().remove();
                });

                initProp.find(".panel-add-btn").bind("click",function(e){
                    var tr = initProp.find("table tbody tr:first").clone(true);
                    tr.appendTo($(this).prev("table"));
                    tr.show();
                });


                var ocode = $("#eocode").val();
                if(ocode){
                    $.post("../../wf/object/getAttr.do",{json:JSON.stringify({code:ocode})},function(data){
                        for(var i =  0 ; i < data.length ; i++){
                            var option = $("<option/>");
                            option.val(data[i]["attrCode"]);
                            option.text(data[i]["attrName"]);
                            option.appendTo("#initProp tbody tr:eq(0) select[name=propName]");
                        }

                        var enterArr =  _props[_k].value || [];
                        $("#initProp tbody tr:gt(0)").remove() ;
                        for(var i  = 0 ; i < enterArr.length ; i++){
                            var enter = enterArr [i] ;
                            var tr = initProp.find("table tbody tr:first").clone(true);
                            for(var k in  enter){
                                $("*[name="+ k +"]",tr).val(enter[k]);
                            }
                            tr.appendTo(initProp.find("table tbody"));
                            tr.show();
                        }
                    });
                }
            });

            $('#'+_div).data('editor', this);
        }

        this.destroy = function(){
            var tr = $("#initProp tbody tr:gt(0)") ;
            if(tr.length < 1){
                return ;
            }
            var arr = [] ;
            for(var i  = 0 ; i < tr.length ; i++){
                var attr = {};
                $("select,input",tr[i]).each(function(idx , ele){
                    attr[$(ele).attr("name")] = $(ele).val();
                });
                arr.push(attr);
            }
            _props[_k].value = arr ;

        }
    },
    rolesEditor: function(){
        var _this = this ;
        var _props,_k,_div,_src,_r;
        this.init = function(props, k, div, src, r){
            _props=props; _k=k; _div=div; _src=src; _r=r;

            var propEditer = $("#propEditer").clone(true);
            propEditer.appendTo('#'+_div);
            propEditer.show();
            propEditer.unbind("click").bind("click",function(e){

                $(".prop-pop").remove();

                var rolesProp = $("#rolesPropDiv").clone(true);
                rolesProp.addClass("prop-pop");

                rolesProp.appendTo('#'+_div);
                rolesProp.show();

                rolesProp.find("table thead tr:first th img").bind("click",function(){
                    _this.destroy();
                    rolesProp.remove();
                });

                rolesProp.find("table tbody tr:first td:eq(0)").bind("click",function(){
                    $(this).parent().remove();
                });

                rolesProp.find("table tbody tr td:eq(1)").delegate("select","change",function(){
                    var index = $("option:selected",$(this)).index();
                    var td = $(this).parent().parent().find("td:eq(3)").empty() ;
                    if(index == 0){
                        var input = $( '<div><input name="org_text" type="text"/>' +
                            '<label class="check-box-item" style="height: auto;"></label></div>') ;
                        input.appendTo(td);
                        input.find("input").bind("click", _this.getorg );
                    }else if(index == 2){
                        var input = $( '<input name="org_text" type="text"/>') ;
                        input.appendTo(td);
                    }else if(index == 3 || index == 4){
                         _this.getRole(td.empty(),null);
                    }else if(index == 5){
                        var input = $( '<input name="org_text" type="text"/>') ;
                        input.appendTo(td);
                    }else{
                        $(this).parent().parent().find("td:eq(3)").text("直接上级领导")
                    }
                });

                //添加一行
                rolesProp.find(".panel-add-btn").bind("click",function(event1){
                    var tr1 = rolesProp.find("table tbody tr:eq(0)").clone(true);
                    tr1.appendTo($(this).prev("table"));
                    tr1.find("input").val("");
                    tr1.find("input").bind("click", _this.getorg );
                    tr1.show();
                    event1.stopPropagation();
                });

                //重新显示时
                var rolesArr =  _props[_k].value || [];
                for(var i  = 0 ; i < rolesArr.length ; i  ++ ){
                    var tr1 = rolesProp.find("table tbody tr:eq(0)").clone(true);
                    tr1.find("input").val(rolesArr[i].org_text);
                    tr1.find("input").bind("click", _this.getorg );
                    tr1.appendTo(rolesProp.find("table tbody"));
                    var label = tr1.find("td:eq(3) label"); //值

                    if(rolesArr[i].type == 0){
                        label.empty();
                        if(rolesArr[i].role_code){
                            $.each(rolesArr[i].role_code ,function(idx,org){
                                var checkbox = $("<input type='checkbox' name='roles' value='"+ org["value"] +"' title='"+org["title"]+"'/>"+org["title"]+"");
                                checkbox.appendTo(label);
                                if(org["checked"]){
                                    checkbox.prop("checked",true)
                                }
                            });
                        }
                    }else if(rolesArr[i].type == 1){
                        tr1.find("input").val("直接上级领导");
                    }else if(rolesArr[i].type == 3 || rolesArr[i].type == 4){
                        _this.getRole(tr1.find("td:eq(3)").empty(),rolesArr[i].org_text);
                    }else if(rolesArr[i].type == 5){
                        tr1.find("input").val(rolesArr[i].org_text);
                    }
                    tr1.find("td:eq(1) select").val(rolesArr[i].type) ;
                    tr1.show();
                }
            });

            $('#'+_div).data('editor', this);
        }

        this.getRole = function(td,value){
            var select = $("<select name='org_text'></select>");
            select.appendTo(td) ;
            //获取角色
            $.post("../../admin/role/get.do",{},function(data){
                $.each(data,function(idx,role){
                    var option = $("<option value='"+role["rolecode"]+"'>"+role["rolename"]+"</option>");
                    option.appendTo(select);
                })
                if(value){
                    select.val(value);
                }
            });
        }

        this.getorg = function(event2){
                var $this = this ;
                //获取部门
                var orgModle = UI.get("orgModle");
                orgModle.css({width:"450px"});
                orgModle.show();
                orgModle.getSubmitBtn().bind("click",function(CEvent){
                    var objs = UI.get("orgTree").getSelectValues();
                    var orgStr = "" ;
                    for(var i = 0 ; i < objs.length ; i++){
                        var obj = objs[i];
                        if(obj){
                            if(i != 0){
                                orgStr += ";"
                            }
                            orgStr += obj["code"] + "," +  obj["name"] ;
                        }
                    }
                    $($this).val(orgStr);
                    UI.get("orgModle").hide();

                    //获取角色
                    $.post("../../admin/role/get.do",{json:JSON.stringify({org_text : orgStr})},function(data){
                        $("#roles").empty();
                        var role_code = $($this).parent().find("label");
                        role_code.empty();
                        var roles = data ;
                        $.each(roles,function(i,role){
                            var checkbox = $("<input type='checkbox' name='roles' value='"+role["rolecode"]+"' title='"+role["rolename"]+"'/>"+role["rolename"]+"");
                            checkbox.appendTo(role_code);
                            checkbox.unbind("click").bind("click",function(e){
                                if(this.checked){
                                    $(this).prop("checked",true);
                                }else{
                                    $(this).prop("checked",false);
                                }
                                e.stopPropagation();
                            });
                        });
                    });

                    CEvent.stopPropagation();
                });

                event2.stopPropagation();
        }

        this.destroy = function(){
            var tr = $("#rolesProp tbody tr:gt(0)") ;
            if(tr.length < 1){
                return ;
            }
            var arr = [] ;
            for(var i  = 0 ; i < tr.length ; i++ ){
                var attr = {};
                attr.org_text = $(tr[i]).find("*[name='org_text']").val() || "" ;
                attr.type = $(tr[i]).find("td:eq(1) select").val() ;
                if(attr.type == 0){
                    var checkboxs  = $(tr[i]).find("label input");
                    var boxs  = [];
                    checkboxs.each(function(idx,checkbox){
                        var box = {};
                        box.name = $(checkbox).attr("name");
                        box.checked = $(checkbox).is(":checked");
                        box.title = $(checkbox).attr("title");
                        box.value = $(checkbox).val();
                        boxs.push(box);
                    });
                    attr.role_code = boxs ;
                }
                arr.push(attr);
            }
            _props[_k].value =arr ;

        }
    },
    permsEditor: function(){
        var _this = this ;
        var _props,_k,_div,_src,_r;
        this.init = function(props, k, div, src, r){
            _props=props; _k=k; _div=div; _src=src; _r=r;

            var propEditer = $("#propEditer").clone(true);
            propEditer.appendTo('#'+_div);
            propEditer.show();
            propEditer.unbind("click").bind("click",function(e){


                $(".prop-pop").remove();

                var permsProp = $("#permsPropDiv").clone();
                permsProp.addClass("prop-pop");

                permsProp.appendTo('#'+_div);
                permsProp.show();

                permsProp.find("table thead tr:first th img").bind("click",function(){
                    _this.destroy();
                    permsProp.remove();
                });

                var ocode = $("#eocode").val();
                if(ocode){
                    $.post("../../wf/object/getAttr.do",{json:JSON.stringify({code:ocode})},function(data){
                        $("#permsProp tbody tr:gt(0)").remove() ;
                        for(var i =  0 ; i < data.length ; i++){
                            var clone = permsProp.find("table tbody tr:first").clone();
                            $("span:eq(0)",clone).text(data[i]["attrName"]);
                            $("input[name=attrCode]",clone).val(data[i]["attrCode"]);
                            clone.appendTo(permsProp.find("table tbody"));
                            $(":checkbox:eq(0)",clone).unbind("click").bind("click",function(e){
                                if(!this.checked){
                                    $(":checkbox:eq(1)",$(this).parentsUntil("tbody")).prop("checked",false);
                                    //$(":checkbox:eq(2)",$(this).parentsUntil("tbody")).prop("checked",false);
                                }else{
                                    $(":checkbox:eq(2)",$(this).parentsUntil("tbody")).prop("checked",false);
                                }
                                e.stopPropagation();
                            });
                            $(":checkbox:eq(1)",clone).unbind("click").bind("click",function(e){
                                if(this.checked){
                                    $(":checkbox:eq(1)",$(this).parentsUntil("tbody")).prop("checked",true);
                                    $(":checkbox:eq(2)",$(this).parentsUntil("tbody")).prop("checked",false);
                                }else{
                                    $(":checkbox:eq(0)",$(this).parentsUntil("tbody")).prop("checked",false);
                                   // $(":checkbox:eq(2)",$(this).parentsUntil("tbody")).prop("checked",false);
                                }
                                e.stopPropagation();
                            });
                            $(":checkbox:eq(2)",clone).unbind("click").bind("click",function(e){
                                if(this.checked){
                                    //$(":checkbox:eq(0)",$(this).parentsUntil("tbody")).prop("checked",false);
                                   // $(":checkbox:eq(1)",$(this).parentsUntil("tbody")).prop("checked",false);
                                }
                                e.stopPropagation();
                            });
                            clone.show();
                        }

                        var permsArr =  _props[_k].value || {} ;
                        var rows = $("#permsProp tbody tr:gt(0)") ;
                        for(var i  = 0 ; i < rows.length ; i++){
                            var row = rows [i] ;
                            var attrCodeVal = $("input[name=attrCode]",row).val();
                            try{
                                var perms = permsArr[attrCodeVal];
                                for(var j  = 0 ; j < perms.length ; j++){
                                    $("input[name="+perms[j]+"]",$(row)).attr("checked",true);
                                }
                            }catch (e){
                                //console.error(attrCodeVal + "没找到");
                            }
                        }
                    });
                }
            });

            $('#'+_div).data('editor', this);
        }

        this.destroy = function(){
            var tr = $("#permsProp tbody tr:gt(0)") ;
            if(tr.length < 1){
                return ;
            }
            var attr = {};
            for(var i  = 0 ; i < tr.length ; i++){
                var r = []
                var code  =  $("input[name=attrCode]",tr[i]).val();
                $("input",tr[i]).each(function(idx , ele){
                    if($(ele).is(":checked")){
                        r.push($(ele).attr("name"));
                    }
                });
                attr[code] = r ;
            }
            _props[_k].value = attr ;

        }
    },
    approveEditor: function(){
        var _this = this ;
        var _props,_k,_div,_src,_r;
        this.init = function(props, k, div, src, r){
            _props=props; _k=k; _div=div; _src=src; _r=r;

            var propEditer = $("#propEditer").clone(true);
            propEditer.appendTo('#'+_div);
            propEditer.show();
            propEditer.unbind("click").bind("click",function(e){

                $(".prop-pop").remove();

                var approveProp = $("#approvePropDiv").clone(true);
                approveProp.addClass("prop-pop");

                approveProp.appendTo('#'+_div);
                approveProp.show();

                approveProp.find("table thead tr:first th img").bind("click",function(){
                    _this.destroy();
                    approveProp.remove();
                });

                approveProp.find("table tbody tr:first td:eq(0)").bind("click",function(){
                    $(this).parent().remove();
                });

                approveProp.find(".panel-add-btn").bind("click",function(e){
                    var tr = approveProp.find("table tbody tr:first").clone(true);
                    tr.appendTo($(this).prev("table"));
                    tr.show();
                });


                var ocode = $("#eocode").val();
                if(ocode){
                    $.post("../../wf/object/getAttr.do",{json:JSON.stringify({code:ocode})},function(data){
                        for(var i =  0 ; i < data.length ; i++){
                            var option = $("<option/>");
                            option.val(data[i]["attrCode"]);
                            option.text(data[i]["attrName"]);
                            option.appendTo("#approveProp tbody tr:eq(0) select[name=propName]");
                        }

                        var approveArr =  _props[_k].value || [];
                        $("#approveProp tbody tr:gt(0)").remove() ;
                        for(var i  = 0 ; i < approveArr.length ; i++){
                            var approve = approveArr [i] ;
                            var tr = approveProp.find("table tbody tr:first").clone(true);
                            for(var k in   approve){
                                $("*[name="+ k +"]",tr).val( approve[k]);
                            }
                            tr.appendTo(approveProp.find("table tbody"));
                            tr.show();
                        }
                    });
                }
            });

            $('#'+_div).data('editor', this);
        }

        this.destroy = function(){
            var tr = $("#approveProp tbody tr:gt(0)") ;
            if(tr.length < 1){
                return ;
            }
            var arr = [] ;
            for(var i  = 0 ; i < tr.length ; i++){
                var attr = {};
                $("select,input",tr[i]).each(function(idx , ele){
                    attr[$(ele).attr("name")] = $(ele).val();
                });
                arr.push(attr);
            }
            _props[_k].value = arr ;
        }
    }
});

})(jQuery);