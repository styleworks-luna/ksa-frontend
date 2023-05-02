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
            sessionStorage.removeItem('attend_id');
            alert("로그아웃 되었습니다.")
            window.location = "Index.html";
        }
    });

    const attend_id = sessionStorage.getItem('attend_id');
    if(attend_id !== null){
        $("[data-menu_box] ul").append("<li data-logout_row><button data-logout_btn type='button'>로그아웃</button></li>")
    }

    const url = window.location.href;
    const base_url = url.split("/").slice(0, 3).join("/") + "/";
});
