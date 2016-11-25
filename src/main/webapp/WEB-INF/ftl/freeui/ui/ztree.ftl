<#macro ztree id=''  url='' async="false" noneJSONParam="true" paramName="null" params="{}"
    nodeIdName="id" nodeName="name" simpleData='false' parentIdName="parent_id" showIcon="false"
    onSelected="null">

    <script type="text/javascript">
        UI.ZTree || document.write("<link rel='stylesheet' href='${res}/jquery-ztree/css/zTreeStyle/zTreeStyle.css'/>"
                        + "<script src='${res}/jquery-ztree/js/jquery.ztree.core-3.5.min.js'>"+"<"+"/script>"
                        + "<script src='${res}/freeui/js/ztree.js'>"+"<"+"/script>");
    </script>

    <ul id="${id}" class="ztree"></ul>

    <script  type="text/javascript">
        UI.elements["${id}"] = new UI.ZTree({
            onSelected:${onSelected},
            url :"${url}",
            async : ${async},
            id : "${id}",
            noneJSONParam : ${noneJSONParam},
            paramName : ${paramName},
            params : ${params},
            showIcon : ${showIcon},
            nodeIdName : '${nodeIdName}',
            nodeName : '${nodeName}',
            parentIdName : '${parentIdName}',
            simpleData : ${simpleData}
        });
    </script>
</#macro>