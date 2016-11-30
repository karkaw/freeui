<#macro modal id='' title='' style="" buttonClass="btn btn-primary" onShow="null" gridId='' form='' showButton=true class="">
    <#assign gg = '${id!}'>
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
            <#--
                1、默认显示Modal的提交按扭
                2、不显示Modal的提交按钮，则显示Form的提交按钮
                3、自定义的提交按钮
            -->
            UI.elements["${id}"] = new UI.Modal({
                id : '${id}',
                onShow : ${onShow}
            });

            var modal = UI.get('${id}');
            <#if form!=''>
                var form =  new UI.get('${form}');
            <#else >
                var form =  new UI.get("${ff}");

            </#if>
            <#if showButton>
                $("#submitBtn",$("#${id}")).unbind("click").bind("click",function(){
                    modal.getSubmitBtn().click(function () {
                        form.refresh = false ;
                        form.submit(null,function(){
                            sunmitAfter();
                        });
                    });
                })
            <#else>
            <#if ff!=''>
                form.getSubmit().click(function () {
                    form.submit(null,function () {
                        sunmitAfter();
                    })
                })


                var sunmitAfter = function () {
                    UI.get("${id}").hide();
                    <#if gridId!=''>
                        UI.get("${gridId}").reload();
                    </#if>
                    <#if form!=''>
                        form.removeValues(true)
                    </#if>
                }
                <#assign ff = ''>
            </#if>
        </#if>
        });
    </script>

</#macro>