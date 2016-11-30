 <#--
表格标签：用于显示列表数据。
	value：列表数据，可以是Pagination也可以是List。
-->
 <#macro grid id='' action="list.do" psize='10' height='350px' mutil='true' hasNoPageTool='false' datatype='json'>
	 <#assign mutil=mutil/><#--表头-->
 <div style='overflow:auto;padding-right:18px'>
     <#assign i=-1/><#--表头-->
     <table class='table table-striped table-bordered table-hover' id='${id}_thead' style="margin-bottom:0px">
         <thead>
         <tr style="background:#f2f2f2;margin-right: 25px">
             <#nested mutil,i,true/>
         </tr>
         </thead>
     </table>
 </div>

 <#--使用Ajax获取数据并分页-->
     <#assign i=-2/>
 <div style='height:${height};overflow-y:scroll;position:relative;border:1px solid #d9d9d9'>
     <table class="table table-striped table-bordered table-hover" style='padding-right:0px;border-size:0px' id='${id}'>
         <tbody>
         <tr style="display:none">
             <#nested mutil,i,true/>
         </tr>
         </tbody>
     </table>
 </div>

 <script type="text/javascript" src="${res}/freeui/js/grid.js"></script>
 <script type="text/javascript">
		$(function(){
			var grid = new UI.Grid({
                id:'${id}',
                url:'${action}',
                mutil:${mutil},
                datatype : '${datatype}',
                hasNoPageTool:${hasNoPageTool}});
			grid.initPage();
			grid.load();
			grid.initModel();
			<#--
			var lis = ['next','last','first','previous'] ;
			$("#${id}_page").find("li").each(function(idx,li){
                $(this).on("click",function(){
                    grid.to(lis[idx]);
                });
			});
			-->

			$("#${id}_thead").resize(function(){
				grid.resizeTable();
			});

			UI.elements["${id}"] = grid ;
		});
	</script>
 </#macro>