$(function () {
    // 공통 사이드바 로드
    $("#sidebar-placeholder").load("/admin/sidebar.html", function () {
        var path = window.location.pathname.split("/").pop();
        if (path === "") path = "index.html";
        $("#accordionSidebar .nav-item").removeClass("active");
        $("#accordionSidebar .nav-link").each(function () {
            if ($(this).attr("href") === path) {
                $(this).parent().addClass("active");
            }
        });
    });
});