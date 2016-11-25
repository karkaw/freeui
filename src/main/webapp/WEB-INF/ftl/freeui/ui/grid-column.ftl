<#--
表格列标签：展示数据列。
	title：标题（列头）。直接显示字符串。默认""。
	code：标题（列头）。显示国际化信息。默认""。
	width：列宽。默认""。
	align：对齐方式。
	class：css样式class
	style：css样式style
	class：css样式class
	style：css样式style
	name: 从服务器返回的数据名称，支持'.'表达式，比如student.name。
	    后面可以加"?method"对数据进行格式化，其中method为grid.js中定义的格式化器名称，或者为window对象的函数命名。
	onload:js函数，自定义加载数据，当指定这个的时候，column显示的数据将有这个函数自己指定。
参数形式为(object, data)其中object是整行数据，data是name对应的数据,this为当前列本身，即调用者为当前列的dom对象。
-->
<#macro column type='' name="" onload="" title="" code="" width="" align="" class="" style="" order="false">
	<#--多选时-->
	<#if type!="">
		<#if i==-1 >
            <#--表头-->
			<th style='word-break:break-all;text-align: center;${style}'<#lt/><#rt/>
                <#if width!=""> width="${width}"</#if><#lt/><#rt/>
                <#if class!=""> class="${class}"</#if><#lt/><#rt/>
                <#if name!=""> name="${name}" </#if>><#lt/><#rt/>
            	<#if mutil=="true"> <input type='${type}' name='${name}'/></#if><#lt/><#rt/>
            </th>
		<#elseif i==-2 >
			<td style='text-align: center;word-break:break-all;heigth:0px;${style}' <#if width!=""> width="${width}"</#if><#lt/><#rt/>
                            <#if name!=""> name="${name}" </#if><#lt/><#rt/>
                            <#if onload!=""> onload="${onload}" </#if><#lt/><#rt/>
                            <#if class!="">class="${class}"</#if>><#lt/><#rt/>
                            <input type='${type}' name='${name}'/><#lt/><#rt/>
            </td>
		<#else>
			<td style='word-break:break-all;${style}'<#if width!=""> width="${width}"</#if><#lt/><#rt/>
                <#if name!=""> name="${name}" </#if><#lt/><#rt/>
                <#if onload!=""> onload="${onload}" </#if><#lt/><#rt/>
                <#if align!=""> align="${align}"</#if><#lt/><#rt/>
                <#if class!=""> class="${class}"</#if> ><#lt/><#rt/>
                <input type='${type}' name='${name}'/><#lt/><#rt/>
            </td>
		</#if>
		<#return>
	</#if>
	<#if  type="" && title="" && code="">
		<td>没有指定title</td><#return>
	</#if>
	<#if i==-1>
		<th  style="word-break:break-all;text-align: center;${style}"<#lt/><#rt/>
            <#if width!=""> width="${width}"</#if><#lt/><#rt/>
            <#if class!=""> class="${class}"</#if><#lt/><#rt/>
            <#if order=="true">order="true"</#if><#lt/><#rt/>
             <#if name!="">name="${name}"</#if>><#lt/><#rt/>
            <#if title!="">${title} <#else> <@s.mt code=code text=code/> </#if><#lt/><#rt/>
            <#if order=="true"><div class="sort sort-gray pull-right" style="cursor:pointer"></div></#if><#lt/><#rt/>
        </th>
	<#elseif i==-2>
		<td style='text-align: center;heigth:0px;word-break:break-all;${style}' <#if width!=""> width="${width}"</#if><#lt/><#rt/>
            <#if name!=""> name="${name}" </#if><#lt/><#rt/>
            <#if onload!=""> onload="${onload}" </#if><#lt/><#rt/>
            <#if class!="">class="${class}"</#if>><#lt/><#rt/>
            <#nested/>
        </td>
	<#else>
		<td <#if width!="">width="${width}"</#if><#lt/><#rt/>
            <#if name!=""> name="${name}" </#if><#lt/><#rt/>
            <#if onload!=""> onload="${onload}" </#if><#lt/><#rt/>
            <#if align!="">align="${align}"</#if><#lt/><#rt/>
            <#if class!="">class="${class}"</#if><#lt/><#rt/>
            <#if style!="">style="${style}"</#if>><#lt/><#rt/>
            <#nested/>
        </td>
	</#if>
</#macro>