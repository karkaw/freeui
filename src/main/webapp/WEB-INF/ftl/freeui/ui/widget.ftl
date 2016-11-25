<#--
	id--widget编号
	config--是否显示配置按钮
	refresh--是否显示刷新按纽
	wmize--是否显示最小化按钮
	wclose--是否显示关闭窗口按钮
	
javascript函数：
	addButton(id,label) --添加按钮，返回是button
		id--按钮编号
		label--按钮文字
	addTitle(title);			--添加标题
		title--标题内容
	*addButton()和addTitle()只会执行后调用的函数
	
	addClass(className)--设置button样式
		className--样式ID
-->

<#macro widget id='' title='' config='false' refresh='false' wmize='false' wclose='false'>
        <div class="widget-box" <#if id!=''>id=${id}</#if>>
           <div class="widget-header">
              <div class="pull-left">
              		<#if title!=''><font style='font-weight: bold;'>${title}</font></#if>
              </div>
              <div class="widget-toolbar">
                  <div class="btn-toolbar">
                      <div class="btn-group">
						<#if config='true'>
							<a data-action="settings"><i class="icon-cog" ></i></a>
						</#if>
						 <#if refresh='true'>
							<a  data-action="reload"><i class="icon-refresh"></i></a>
						</#if>
						 <#if wmize='true'>
							<a href="#"  data-action="collapse"><i class="icon-chevron-up"></i></a>
						</#if>
						 <#if wclose='true'>
							<a href="#"  data-action="close"><i class="icon-remove"></i></a>
						</#if>
					  </div>
				  </div>
              </div>  
           </div>
          <div class="widget-body">
              <div class="widget-toolbox">
                  <div class="btn-toolbar">
                      <div class="btn-group"></div>
				  </div>
			  </div>
			   <#nested/>
      	  </div> 
    </div>

    <script type="text/javascript" src="${res}/freeui/js/widget.js"></script>
    <script>
        UI.elements["${id}"] = new UI.Widget("${id}")
    </script>
</#macro>