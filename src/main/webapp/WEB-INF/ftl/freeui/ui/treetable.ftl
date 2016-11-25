<#macro treetable id='' hasHead=true url='' nodeIdName="id" height='auto' parentIdName="parent_id" mutil="true"
    onSelected="null" beforeLoadTree="null" noneJSONParam="true" params="{}">

    <script type="text/javascript">
        window.TreeTable || document.write("<link rel='stylesheet' href='${res}/jquery-treetable/css/jquery.treetable.css'/>"
                        + "<link rel='stylesheet' href='${res}/jquery-treetable/css/jquery.treetable.theme.default.css'/>"
                        + "<script src='${res}/jquery-treetable/js/jquery.treetable.js'>"+"<"+"/script>"
                        + "<script src='${res}/freeui/js/treetable.js'>"+"<"+"/script>");
    </script>

    <#if hasHead>
        <div style='overflow:auto;padding-right:18px'>
            <#assign i=-1/><#--表头-->
            <table class='table table-bordered' id='${id}_thead' style="margin-bottom:0px">
                <thead>
                <tr style="background:#f2f2f2;margin-right: 25px">
                    <#nested mutil,i,true/>
                </tr>
                </thead>
            </table>
        </div>
    </#if>

    <#assign i=-3/>
    <div style='height:${height};position:relative;'>
        <table class="table table-bordered" style='padding-right:0px;border-size:0px' id='${id}'>
            <tbody>
            <tr style="display:none">
                <#nested mutil,i,true/>
            </tr>
            </tbody>
        </table>
    </div>

    <script  type="text/javascript">
        UI.elements["${id}"] = new UI.TreeTable({
            beforeLoadTree:${beforeLoadTree},
            onSelected:${onSelected},
            url :"${url}",
            id : "${id}",
            mutil: ${mutil},
            noneJSONParam : ${noneJSONParam},
            params : ${params},
            nodeIdName : '${nodeIdName}',
            parentIdName : '${parentIdName}'
        });
    </script>
</#macro>