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
    $.extend(true, fd.control, {
        gridEditor:function(){
            var _this =this ;
            this.init = function(src){
                var data  = fd.props.option || [{attrName:"选项1",attrCode:"op1"},
                    {attrName:"选项2",attrCode:"op2"},{attrName:"选项3",attrCode:"op3"}] ;

                var table = $("<table class='table table-striped table-bordered table-hover'>" +
                			  "	 <thead></thead><tbody></tbody>" +
                			  "</table>");
                var htr = $("<tr></tr>");
                htr.appendTo(table.find("thead"));

                var hhtr = $("<tr class='hide'></tr>");
                hhtr.appendTo(table.find("thead"));

                for(var i = 0; i<data.length; i++){
                    var names = data[i].attrCode.split(fd.props.SP);
                    var name = "" ;
                    for(var j = 0; j<names.length; j++){
                        if(j != 0){
                            name +=  fd.props.SP;
                        }
                        if(j == names.length -2){
                            name += names[j] +  "[######]";
                        }else{
                            name += names[j];
                        }
                    }

                    name = name.replace(/-/g,".");

                    var hhd  = $("<th class='text-align' name="+ name +">"+data[i].attrName +"</th>");
                    var htd  = $("<td class='text-align' name='"+ name +"'>" 
                    		   + "	<input type='text' name='" + name + "'/>" 
                    		   + "</td>");
                    hhd.appendTo(htr);
                    htd.appendTo(hhtr);//
                }

                for(var i = 0; i<3; i++){
                    var tr =  table.find("thead tr:eq(1)");
                    var clongTR = tr.clone();

                    var td  = $("td",clongTR);
                    td.each(function(idx,ele){
                        if($(ele).attr("name")){
                            var name = $(ele).attr("name").replace("######",i);
                            var field = $("input,select,textarea",$(ele));

                            $(ele).attr("name",name);
                            field.attr("name",name);
                        }
                    });

                    clongTR.appendTo(table.find("tbody"));
                    clongTR.removeClass("hide");
                }

                return table ;
            };
            
            this.reload = function(src){
                src.find(".widget-content div:eq(1)").empty();
                _this.init(src).appendTo(src.find(".widget-content div:eq(1)"));
            };
            
        }
    });
})(jQuery);