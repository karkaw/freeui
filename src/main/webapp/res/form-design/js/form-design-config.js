/**
 * 配置控件的属性设置项
 * 
 * @auther karka.w
 */

(function($){
   var  fd = $.formdesign ;

    $.extend(true,fd.config.form,{
        object:{
            title:"label",
            text:"主对象类型",
            name:"object",
            value:"",
            editor:function(){
                return new fd.plugins.formEditor();
            }
        },
        title:{
            title:"label",
            text:"标题",
            name:"object",
            value:"",
            editor:function(){
                return new fd.plugins.headTitleEditor();
            }
        },
        headDesc:{
            title:"label",
            text:"标题描述",
            name:"object",
            value:"",
            editor:function(){
                return new fd.plugins.headDescEditor();
            }
        }
    });


    $.extend(true,fd.config.text,{
        desc:"这是一个文本框",
        filed:{
            title:"label",
            text:"关联主对象属性",
            name:"fied",
            value:"",
            option:{},
            type: fd.mappper["string"],
            editor:function(){
                return new fd.plugins.fieldEditor();
            }
        },
        label:{
            title:"label",
            text:"标题",
            name:"username",
            value:"",
            editor:function(){
                return new fd.plugins.labelEditor();
            }
        },
        layout:{
            title:"label",
            text:"标题布局",
            name:"layout",
            value:"row",
            editor:function(){
                return new fd.plugins.layoutEditor([{name:"横",value:"row"},{name:"竖",value:"col"}]);
            }
        },
        description:{
            title:"label",
            text:"描述",
            name:"layout",
            value:"",
            editor:function(){
                return new fd.plugins.descriptionEditor();
            }
        },
        required:{
            title:"label",
            text:"必填项目",
            name:"required",
            value:false,
            editor:function(){
                return new fd.plugins.requiredEditor();
            }
        },
        size:{
            title:"label",
            text:"控件大小",
            name:"required",
            value:"small",
            editor:function(){
                return new fd.plugins.sizeEditor([{name:"小",value:"small"},{name:"中",value:"medium"},{name:"大",value:"large"}]);
            }
        }
    });

    $.extend(true,fd.config.textarea,fd.config.text,{

    });

    $.extend(true,fd.config.radio,fd.config.text,{

    });

    $.extend(true,fd.config.select,fd.config.text,{

    });

    $.extend(true,fd.config.checkbox,fd.config.text,{

    });

    $.extend(true,fd.config.grid,fd.config.text,{
        filed:{
            type: fd.mappper["grid"] //控件和字段类型的映射
        },
        option:{
            title:"label",
            text:"选项",
            name:"required",
            value:false,
            editor:function(){
                return new fd.plugins.optionEditor();
            }
        },
        control: {
        	value:[],
        	editor:function(){
                return new fd.control.gridEditor();
            }
        }
    });

})(jQuery);





