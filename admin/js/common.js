$(function () {
    // 공통 사이드바 로드
    $("#sidebar-placeholder").load("/admin/sidebar.html", function () {
        var path = window.location.pathname.split("/").pop() || "index.html";

        $("#accordionSidebar .nav-item").removeClass("active");

        $("#accordionSidebar .nav-link").each(function () {
            var href = $(this).attr("href");

            if (href === path) {
                $(this).parent().addClass("active");
                return false; // loop 종료
            }

            var pathDomain = path.replace(/(List|Write|Add|Upload|Detail|View|Setting)\.html$/, "");
            var hrefDomain = href.replace(/(List|Write|Add|Upload|Detail|View|Setting)\.html$/, "");

            if (pathDomain !== "" && pathDomain === hrefDomain) {
                $(this).parent().addClass("active");
                return false;
            }
        });
    });
});