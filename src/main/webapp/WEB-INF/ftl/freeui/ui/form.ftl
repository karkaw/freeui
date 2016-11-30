<#--
<form></form>
validate:提交前的验证

操作结束：
	1、提示
	2、转向
	3、刷新
数据提交：
    submitType:提交方式  default：普通表单提交 提交后转向 submitForward ,ajax ： 使用ajax自动提交 ，hand :自定义函数提交
    success:提交成功后，的执行函数
    complete:
    error:
    paramType : 提交请求的数据格式，json,string,file
操作完成：
    1、清空变单
    2、重定向页面
    3、操作结束后的提示
-->
<#macro form 
	id="" action="" submitReflush="" redirect="" submitAfter="" showResult="true" col='0'
	method="post" target="" enctype=""  width="100%" labelWidth="20" required="false"  name=""
	class="form-horizontal" style="" size="" title="" disabled="" 	onsubmit=""  hasButton=true
    submitType="ajax" validate=""   paramName="json" success="" refresh=false datatype="json">
<form  class="${class}"<#rt/>
 	    method="${method}"<#rt/>
 	    action="${action}"<#rt/>
		<#if id!=""> id="${id}"</#if><#rt/>
		<#if target!=""> target="${target}"</#if><#rt/>
		<#if enctype!=""> enctype="${enctype}"</#if><#rt/>
		<#if onsubmit!=""> onsubmit="${onsubmit}"</#if><#rt/>
		<#include "common-attributes.ftl"/><#rt/>
        role="form"
		>
        <#assign ff = '${id!}'>
		<#nested i,true/>
    <#if hasButton>
	<div class="clearfix form-actions">
		<div class="col-md-offset-3 col-md-9">
			<button class="btn btn-info" type="button"  id="submitBtn">
				<i class="icon-ok bigger-110"></i>
					提交
			</button>

			&nbsp; &nbsp; &nbsp;
			<button class="btn" type="reset" id="resetBtn">
				<i class="icon-undo bigger-110"></i>
					重置
			</button>
		</div>
	</div>
    </#if>
</form>

<script type="text/javascript" src="${res}/freeui/js/form.js"></script>
<script type="text/javascript">
        $(function(){
            var validate = window['${validate}'];
            var submitAfter = window['${submitAfter}'];
            <#if submitType =="default">
                var form = $("form",$("#${id}"));
                form.submit();
            <#elseif submitType=="ajax">
                var form = new UI.Form({
                    id:"${id}", url : "${action}" ,
                    datatype:'${datatype}'
                    <#if success != ''>,success:${success}</#if>
                });
                <#if refresh>
                    form.setReflush(${refresh?string});
                </#if>
                <#if redirect != "">
                    form.setRedirectUrl("${redirect}");
                </#if>
                <#if hasButton>
                    $("#submitBtn",$("#${id}")).on("click",function(){
                        form.submit(null,submitAfter
                             <#if gg??  >
                                || function () {
                                    UI.get("${gg}").hide();
                                }
                             </#if>
                        );
                    });
                </#if>
                UI.elements["${id}"] = form ;
            <#else>
                var form = new UI.Form({
                    id:"${id}", url : "${action}" ,
                    datatype:'${datatype}'
                    <#if success != ''>,success:${success}</#if>
                });
                form.setUrl("${action}");
                <#if redirect != "">
                    form.setRedirectUrl("${redirect}");
                </#if>
                <#if hasButton>
                    $("#submitBtn",$("#${id}")).on("click",function(){
                        (!validate || (typeof validate == 'function' && validate())) && ${submitType}('${id}');
                    });
                </#if>
                UI.elements["${id}"] = form ;
            </#if>
        });
</script>
</#macro>
