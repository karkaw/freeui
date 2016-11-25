<#macro modal id='' title='' style="" buttonClass="btn btn-primary" onShow="null" gridId='' form='' showButton=true class="">
    <!-- 模态框（Modal） -->
    <div class="modal fade"  <#if id!=''>id="${id}"</#if> tabindex="-1" role="dialog"
         aria-labelledby="<#if id!=''>${id}Lable<#else>modalLable</#if>" aria-hidden="true">
        <div class="modal-dialog" style="${style}">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"  aria-hidden="true">×
                    </button>
                    <h4 class="modal-title" id="<#if id!=''>${id}Lable<#else>modalLable</#if>">
                        <#if title!=''>${title}<#else>默认标题</#if>
                    </h4>
                </div>
                <div class="modal-body">
                    <#nested/>
                </div>

                <div class="modal-footer">
                    <#if showButton>
                        <button type="button" class="${buttonClass}" id="submitBtn">
                            提交
                        </button>
                    </#if>
                </div>

            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <script type="text/javascript" src="${res}/freeui/js/modal.js"></script>
    <script type="text/javascript">
        $(function(){
            <#if showButton>
                $("#submitBtn",$("#${id}")).bind("click",function(){
                    var form ;
                <#if form!=''>
                    form =  new UI.get('${form}');
                <#else >
                    form =  new UI.Form({id:$("form",$("#${id}"))});
                </#if>
                    form.refresh = false ;
                    form.submit(null,function(){
                        <#if gridId!=''>
                            UI.get("${id}").hide();
                            UI.get("${gridId}").reload();
                        </#if>
                        <#if form!=''>
                            form.removeValues(true)
                        </#if>
                    });
                });
            </#if>
            UI.elements["${id}"] = new UI.Modal({
                id : '${id}',
                onShow : ${onShow}
            });
        });
    </script>

</#macro>