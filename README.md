# freeui
架构使用了freemarker+jquery+bootstrap的框架
使用方式：
1、如果需要使用标签则需要
    1、在Spring中<prop key="auto_import">/ftl/freeui/index.ftl as ui,/ftl/spring.ftl as s</prop>
    2、在ftl页面中include/ftl/freeui/index.ftl

1、freemarker提供是组件标签
    当使用Freemarker标签的时候会自动引入jquery的js组件，如：
    <@ui.grid id="moduleGrid" psize="10" action="${base}/school/search" height="450px" >
        <@ui.column type='checkbox' width="40px" name="id"></@ui.column>
        <@ui.column title="序号" name="id"></@ui.column>
        <@ui.column title="学校名称" name="schoolName"></@ui.column>
        <!--<@ui.column title="学校简称" name="schoolMiniName"></@ui.column>-->
        <@ui.column title="分区" name="areaName"></@ui.column>
        <@ui.column title="操作">
            <button type="button" class="btn btn-sm btn-success" onclick="updateSchool(this)">修改</button>
            <button type="button" class="btn btn-sm btn-fail" onclick="deleteSchool(this)">删除</button>
        </@ui.column>
    </@ui.grid>
    在JS中就可以使用全局函数来操作grid列表：
    <script>
        var grid = UI.get("moduleGrid");
        grid.reload(params);
    </script>


