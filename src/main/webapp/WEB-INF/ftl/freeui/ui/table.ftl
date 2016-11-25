 <#--
表格标签：用于显示列表数据。
	value：列表数据，可以是Pagination也可以是List。
-->
 <#macro table value id='' action="list.do" psize='10' height='350px' mutil='true'>
    <input type="hidden" name="pageNum" id="pageNum" value="${value.pageNum!}"/>
 	<#--使用Freemarker分页-->
	<#if !value?is_sequence>
		<#local pageList=value.result/>
		<div style='height:${height};overflow-y:scroll;position:relative;border:1px solid #d9d9d9'>
			<table class="table table-striped table-bordered table-hover" style='padding-right:0px;' id='${id}'>
				<#assign mutil=mutil/><#--表头-->
				<#assign i=-1/><#--表头-->
                <thead>
                <tr style="background:#f2f2f2;margin-right: 25px">
					<#nested mutil,i,true/>
                </tr>
                </thead>
				<tbody>
					<#list pageList as row>
						<#if row_index=0>
						<tr style="display:none">
							<#nested mutil,i,true/>
						</tr>
						</#if>
						<#assign i=row_index has_next=row_has_next/>
					<tr>
						<#nested row,row_index,row_has_next/>
					</tr>
					</#list>
				</tbody>
			</table>
		</div>

		<#--分页-->
		<div class="widget-foot" id="${id}_page">
			<div class="pagination pull-right" style="margin: -5px 5px -1px 5px ;">
				<select style="height: 30px; width: 50px; border: 1px solid rgb(221, 221, 221);">
					<option>10</option><option>20</option><option>30</option>
				</select>
			</div>
			<ul class="pagination pull-right"style="margin: -7px 5px -1px 5px ;">
            <#if value.pageNum = value.totalPage>
				<li class="disabled"><a href="#">&gt;</a></li>
				<li class="disabled"><a href="#">»</a></li>
            <#else>
                 <li><a href="#" onclick="_gotoPage(${value.pageNum +1})">&gt;</a></li>
                 <li><a href="#" onclick="_gotoPage(${value.totalPage})">»</a></li>
            </#if>
            </ul>
			<div class="pagination pull-right" style="margin: -5px 5px -1px 5px ;">
				第 <input style="height: 30px; width: 40px; border: 1px solid rgb(221, 221, 221); text-align: center;" value='${value.pageNum}' name="pageSize"> 页
			</div>
			<ul class="pagination pull-right" style="margin: -7px 5px -1px 5px ;">
                <#if value.pageNum = 1>
                    <li class="disabled"><a href="#">«</a></li>
                    <li class="disabled"><a href="#">&lt;</a></li>
                <#else>
                    <li><a href="#"  onclick="_gotoPage(${1})">«</a></li>
                    <li><a href="#"  onclick="_gotoPage(${value.pageNum - 1})">&lt;</a></li>
                </#if>
			</ul>
			<p style="margin: 8px;">第<span>${value.pageNum}</span>/<span>${value.totalPage}</span>页，共<span>${value.totalCount}</span>条</p>
		</div>
 	<#--使用显示全部数据-->
	<#else>
		<#local pageList=value.result/>
		<div style='height:${height};overflow-y:scroll;position:relative;border:1px solid #d9d9d9'>
			<table class="table table-striped table-bordered table-hover" style='padding-right:0px;' id='${id}'>
				<tbody>
					<#list pageList as row>
						<#if row_index=0>
						<tr style="display:none">
							<#nested mutil,i,true/>
						</tr>
						</#if>
						<#assign i=row_index has_next=row_has_next/>
					<tr>
						<#nested row,row_index,row_has_next/>
					</tr>
					</#list>
				</tbody>
			</table>
		</div>
	</#if>
    <script type="text/javascript" src="${res}/freeui/js/grid.js"></script>
    <script type="text/javascript">
         <#--分页-->
         function _gotoPage(pageNo) {
             try{
                var tableForm = document.getElementById("#"+"${id}_form");
                 if(!tableForm){
                     tableForm = document.getElementsByTagName("form")[1];
                 }
                 $("input[name=pageNum]").val(pageNo);
                 tableForm.action="${action}";
                 tableForm.onsubmit=null;
                 tableForm.submit();
             } catch(e) {
                 alert('_gotoPage(pageNo)方法出错');
             }
         }
	 </script>

 </#macro>