function getLoginUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("토큰 디코딩 실패:", e);
        return null;
    }
}


$(function () {
    
    var SidebarType = 'sub';

    // 로그인 사용자 정보
    const userInfo = getLoginUserInfo();

    //페이지 접근제어
    if ( !userInfo || !userInfo.sub ) {
        alert("로그인이 필요합니다.");
        if (!window.location.pathname.endsWith("login.html")) {
            window.location.href = "login.html";
        }
        return;
    }

    $('body').show();

    const currentPage = window.location.pathname.split("/").pop() || "EventGuestList.html";
    
    const subAdminAllowedPages = [
        "EventGuestList.html", 
        "EventGuestView.html", 
        "EventEntryCheck.html"
    ];

    if (userInfo.sub === 'ROLE_SUBADMIN') {
        if (!subAdminAllowedPages.includes(currentPage)) {
            //alert("해당 페이지에 대한 접근 권한이 없습니다.");
            window.location.href = "EventGuestList.html";
            return;
        }
    }else{
        SidebarType = 'main';    
    }

    if(SidebarType == 'main'){
        Sidebar_url = "/admin/sidebar.html";
    }else{
        Sidebar_url = "/admin/sidebar_sub.html";
    }

    // 공통 사이드바 로드
    var cacheBuster = new Date().getTime();
    $("#sidebar-placeholder").load(Sidebar_url + "?v=" + cacheBuster , function () {
        var path = window.location.pathname.split("/").pop() || "index.html";

        $("#accordionSidebar .nav-item").removeClass("active");

        $("#accordionSidebar .nav-link").each(function () {
            var href = $(this).attr("href");

            if (href === path) {
                $(this).parent().addClass("active");
                return false; 
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