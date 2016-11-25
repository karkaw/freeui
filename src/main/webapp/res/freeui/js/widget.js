UI.Widget = function(_el_){ //类
	
	var _this = this ;  //属性
	
	this.el = typeof _el_ == "object" ?  _el_   : $("#" + _el_) ;

	//添加按钮
	this.addButton=function(id,label, styleClass){
		styleClass = styleClass || "btn-default";
		var btn = $('<button id="' + id + '" type="button" class="btn btn-sm ' + styleClass +'">'+label+'</button>');
		//btn.css({'margin-right':'10px','margin-top':'5px','padding':'0 8px'});
		//btn.appendTo(this.el.find(".pull-left"));
		btn.appendTo(_this.el.find(".widget-body .btn-toolbar .btn-group"));
		return btn;
	};
	
	//添加标题
	this.addTitle=function(title){
		this.el.find(".pull-left").empty().append("<font style='font-weight: bold;'>" + title + "</font>");
	};
	
	//设置样式
	this.addClass = function(className){
		this.addClass(className);
	};
};