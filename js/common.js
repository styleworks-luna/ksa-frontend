$(function () {
    $('[data-more_box]').on("click", function() {
        $('[data-menu_box]').show();
    });
    
    $('[data-close_box]').on("click", function() {
        $('[data-menu_box]').hide();
    });
    
    $('[data-logout_btn]').on("click", function() {
        if(confirm("로그아웃 하시겠습니까?")){
            localStorage.removeItem('token');
            window.location = "Index.html";
        }
    });
    const url = window.location.href;
    const base_url = url.split("/").slice(0, 3).join("/") + "/";
    console.log(base_url)
});
