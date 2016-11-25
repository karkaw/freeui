<#macro tree id=''url='' label='' nodeid="" mutil="true" onSelected="null">
    <div class="tree well" <#if id!=''>id='${id}'</#if> >
        <ul>

        </ul>
    </div>

    <script type="text/javascript" src="${res}/freeui/js/tree.js"></script>
    <script  type="text/javascript">
        var tree = new UI.Tree({
            root:false,
            label:"${label?default('name')}",
            url :"${url}",
            id : "${id}",
            treeid:"${nodeid?default('code')}",
            mutil: ${mutil},
            onSelected:${onSelected},
            mouseRigthEvent:function(){

            }
        });
        UI.elements["${id}"] = tree ;
    </script>
</#macro>