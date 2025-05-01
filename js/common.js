$(function () {
    $("[data-more_box]").on("click", function () {
        $("[data-menu_box]").show();
    });

    $("[data-close_box]").on("click", function () {
        $("[data-menu_box]").hide();
    });

    $(document).on("click", "[data-logout_btn]", function () {
        if (confirm("로그아웃 하시겠습니까?")) {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("attend_id");
            alert("로그아웃 되었습니다.");
            window.location = "Index.html";
        }
    });

    const attend_id = sessionStorage.getItem("attend_id");
    if (attend_id !== null) {
        $("[data-menu_box] ul").append("<li data-logout_row><button data-logout_btn type='button'>로그아웃</button></li>");
    }

 document.addEventListener("click", function (event) {

if (event.target.tagName === "A") {
             if (
                 event.target.href.indexOf("Application.html") > -1
             ) {
                 event.preventDefault();
                 alert("KSA하계CEO포럼 참가접수가 마감되었습니다.\n성원에 감사드립니다.")
          }
        }

    });

    const bank = `${base_url}/api/v1/ksa/files?ksaFileType=COPY_OF_BANKBOOK`;
    const bussiness = `${base_url}/api/v1/ksa/files?ksaFileType=BUSINESS_REGISTRATION`;

    $("[data-bank_download]").attr("href", bank);
    $("[data-bussiness_download]").attr("href", bussiness);
});
let url = window.location.href;
let base_url = url.replace(/^(https?:\/\/)?(www\.)?/i, "").split("/")[0];
if (base_url && typeof base_url === "string" && (base_url.toLowerCase().includes("127.0.0.1") || base_url.toLowerCase().includes("localhost"))) {
    base_url = "https://api-ksa.styleworks.kr";
    //base_url = "http://127.0.0.1:8888";
} else {
    base_url = "https://api-" + base_url;
}
// let base_url = "api-ksa.onoffmix.xyz"
const current_year = 2025;
