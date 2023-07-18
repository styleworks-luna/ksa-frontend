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
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('attend_id');
            alert("로그아웃 되었습니다.")
            window.location = "Index.html";
        }
    });

    const attend_id = sessionStorage.getItem('attend_id');
    if(attend_id !== null){
        $("[data-menu_box] ul").append("<li data-logout_row><button data-logout_btn type='button'>로그아웃</button></li>")
    }
});
if (
	window.location.href.indexOf("Index") === -1 &&
	window.location.href.indexOf("Gallery") === -1 &&
	window.location.href.indexOf("Speaker") === -1 &&
	window.location.href.indexOf("Privacy") === -1 &&
	window.location.href.indexOf("FourmInfo") === -1 &&
	window.location.href.indexOf("Performance") === -1 &&
	window.location.href.indexOf("Notice") === -1
) {
	alert("참가등록이 마감되었습니다. 성원에 감사드립니다.");
	window.location = "Index.html";
}