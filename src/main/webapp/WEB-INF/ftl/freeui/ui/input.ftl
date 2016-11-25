<#--
	 type:  text,select,checkbox,radio,file,img,textarea,boolean
	 name: input name
	 labelWidth:label的宽度，1-12。 默认 1
	 textWidth：内容的宽度，1-12。 默认 3
	 class:input的class 
-->

<#macro input type='' label='' name=''  labelClass="" textClass="" inputClass='form-control' buttonClass="ace ace-switch ace-switch-3">
        <div class="form-group">
	      <label <#if labelClass!=''>class="${labelClass}"</#if> ><#if label!=''>${label}</#if></label>
            <#if labelClass!=''><div class="${textClass}"></#if>
                <#if type='' || type ='text'>
                    <input type="text" <#rt/>
                           <#if labelClass!=''>class="${textClass}"</#if><#rt/>
                            placeholder="${label}" <#rt/>
                            <#if name != ''>name='${name}'</#if><#rt/>
                    ></input>
                <#elseif type ='boolean'>
                    <label>
                        <input name="switch-field-1" class="${buttonClass}" type="checkbox">
                        <span class="lbl"></span>
                    </label>
                </#if>
            <#if labelClass!=''>
	        </div>
            </#if>
        </div>
</#macro>