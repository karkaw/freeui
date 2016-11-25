Notice = function(){
	var _this = this ;

	
	this.init = function(){
		var html = '<div id="gritter-notice-wrapper" style="width:300px;height:300px">'+
							'<div id="gritter-item-1" class="gritter-item-wrapper gritter-error hover">'+
								'<div class="gritter-top"></div>'+
								'<div class="gritter-item">'+
									'<div class="gritter-close" style="display: block;"></div>'+
										'<div class="gritter-with-image">'+
											'<span class="gritter-title">通知</span>'+
											'<p>操作成功</p>'+
										'</div>'+
										'<div style="clear:both"></div>'+
								'</div>'+
								'<div class="gritter-bottom"></div>'+
							'</div>'+
						'</div>';
		
	
		$(html).appendTo("body");
		};
};
