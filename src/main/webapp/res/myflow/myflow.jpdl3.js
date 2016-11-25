(function($){
var myflow = $.myflow;

$.extend(true,myflow.config.rect,{
    attr : {
        r : 8,
        fill : '#F6F7FF',
        stroke : '#03689A',
        "stroke-width" : 1
    }
});

$.extend(true,myflow.config.tools.save,{
    onclick: function (c) {
        alert(JSON.stringify("sss:   "+ c));
    }
});

$.title = $.extend(true, {}, {
     name:'title', label:'标题', value:'新建流程', editor:function(){
        return new myflow.editors.inputEditor();
    }
});

var name = $.extend(true, {}, {
    name:'name', label:'名称', value:'', editor:function(){
        return new myflow.editors.inputEditor();
    }
});
var type = $.extend(true, {}, {
    name:'type', label:'流程类型', value:'', editor:function(){
        return new myflow.editors.selectEditor([
            {name: "主流程",value: "main"},
            {name: "子流程", value: "sub"}
        ]);
    }
});
var cpy = $.extend(true, {}, {
    name:'cpy', label:'表单继承', value:'', editor:function(){
        return new myflow.editors.selectEditor([
            { name : "继承主流程表单",value : 1},
            { name : "不继承主流程表单",value :0}
        ]);
    }
});

var desc = $.extend(true, {}, {
    name:'desc', label:'描述', value:'', editor:function(){
        return new myflow.editors.inputEditor();
    }
});

$.ocode = $.extend(true, {}, {
    name:'ocode', label:'表单编码', value:'', editor:function(){
        return new myflow.editors.selectEditor("../../wf/object/get.do","name","code");
    }
});

var enter = $.extend(true, {}, {
    name:'enter', label:'进入条件', value:'', editor:function(){
        return new myflow.editors.enterEditor();
    }
});

var init = $.extend(true, {}, {
    name:'init', label:'初始操作', value:'', editor:function(){
        return new myflow.editors.initOperEdit();
    }
});

var roles = $.extend(true, {}, {
    name:'roles', label:'角色操作', value:'', editor:function(){
        return new myflow.editors.rolesEditor();
    }
});

var perms = $.extend(true, {}, {
    name:'perms', label:'对象权限', value:'', editor:function(){
        return new myflow.editors.permsEditor();
    }
});

var approve = $.extend(true, {}, {
    name:'approve', label:'审批操作', value:'', editor:function(){
        return new myflow.editors.approveEditor();
    }
});

var reject = $.extend(true, {}, {
    name:'reject', label:'驳回操作', value:'', editor:function(){
        return new myflow.editors.approveEditor();
    }
});

$.extend(true,myflow.config.props.props,{
    title : $.title,
    name : name,
    type : type,
    cpy : cpy,
    desc :desc,
    ocode :$.extend(true, {}, {
        name:'ocode', label:'表单编码', value:'', editor:function(){
            return new myflow.editors.selectEditor("../../wf/object/get.do","name","code",true);
        }
    }),
    enter :enter,
    init : init
});

$.extend(true, myflow.config.path.props, {
    enter :enter
});

$.extend(true,myflow.config.tools.states,{
    start : {
        showType:"image",
        type : 'start',
        name : {text:'<<start>>'},
        text : {text:'开始'},
        img : {src : 'img/48/start_event_empty.png',width :48, height:48},
        attr : {width:50 ,heigth:50 },
        props : {
            name: {name:'name',label: '开始', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'开始'},
            ocode: $.ocode
    }},
    end : {
        showType: 'image',
        type : 'end',
        name : {text:'<<end>>'},
        text : {text:'结束'},
        img : {src : 'img/48/end_event_terminate.png',width :48, height:48},
        attr : {width:50 ,heigth:50 },
        props : {
            name: {name:'name', label: '名称', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'结束'},
            ocode: $.ocode,
            approve : approve,
            reject : reject
    }},
    'end-cancel' : {
        type : 'end-cancel',
        name : {text:'<<end-cancel>>'},
        text : {text:'取消'},
        img : {src : 'img/48/end_event_cancel.png',width :48, height:48},
        props : {

    }},
    'end-error' : {
        type : 'end-error',
        name : {text:'<<end-error>>'},
        text : {text:'错误'},
        img : {src : 'img/48/end_event_error.png',width :48, height:48},
        props : {

    }},
    state : {
        showType: 'text',
        type : 'state',
        name : {text:'<<state>>'},
        text : {text:'状态'},
        img : {src : 'img/48/task_empty.png',width :48, height:48},
        props : {
            name: {name:'name',label: '名称', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'步骤'},
            backgo: {name:'backgo', label : '拒绝步骤', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'上一步',value:"last"},{name:'结束',value:"end"}]);}},
            limit: {name:'limit', label : '工作量', value:'', editor: function(){return new myflow.editors.inputEditor();},value:0},
            timers: {name:'timers', label : '工作时间（小时）', value:'', editor: function(){return new myflow.editors.inputEditor();},value:0},
            priory: {name:'priory', label : '优先级', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'低',value:0},{name:'中',value:1},{name:'高',value:2}]);},value:1},
            sign : {name:'sign ', label : '是否会签', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'否',value:0},{name:'是',value:1}]);},value:0},
            ocode:$.ocode,
            roles: roles,
            perms: perms,
            approve : approve,
            reject : reject
    }},
    fork : {
        showType: 'image',
        type : 'fork',
        name : {text:'<<fork>>'},
        text : {text:'分支'},
        img : {src : 'img/48/gateway_parallel.png',width :48, height:48},
        props : {
            name: {name:'name', label: '名称', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'分支'},
            ocode: $.ocode
    }},
    join : {
        showType: 'image',
        type : 'join',
        name : {text:'<<join>>'},
        text : {text:'合并'},
        img : {src : 'img/48/gateway_parallel.png',width :48, height:48},
        props : {
            name: {name:'name', label: '名称', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'合并'},
            ocode: $.ocode
    }},
    task : {
        showType: 'text',
        type : 'task',
        name : {text:'<<task>>'},
        text : {text:'任务'},
        img : {src : 'img/48/task_empty.png',width :48, height:48},
        props : {
            name: {name:'name',label: '名称', value:'', editor: function(){return new myflow.editors.textEditor();}, value:'步骤'},
            backgo: {name:'backgo', label : '拒绝步骤', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'上一步',value:"last"},{name:'结束',value:"end"}]);}},
            limit: {name:'limit', label : '工作量', value:'', editor: function(){return new myflow.editors.inputEditor();},value:0},
            timers: {name:'timers', label : '工作时间（小时）', value:'', editor: function(){return new myflow.editors.inputEditor();},value:0},
            priory: {name:'priory', label : '优先级', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'低',value:0},{name:'中',value:1},{name:'高',value:2}]);},value:1},
            sign : {name:'sign ', label : '是否会签', value:'', editor: function(){return new myflow.editors.selectEditor([{name:'否',value:0},{name:'是',value:1}]);},value:0},
            ocode:$.ocode,
            roles: roles,
            perms: perms,
            approve : approve,
            reject : reject
        }
    }
});
})(jQuery);