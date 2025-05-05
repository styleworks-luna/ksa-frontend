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
                if (event.target.href.indexOf("Application.html") > -1) {
                    event.preventDefault();
                    
                    const ksa_now = new Date();
                    const ksa_startDate = new Date('2025-05-05T13:00:00');
                    const ksa_endDate = new Date('2025-07-09T18:00:00');
                    
                    if (ksa_now < ksa_startDate) {
                        alert("KSA하계CEO포럼 참가접수가 2025년 5월 12일 오후 1시 오픈 예정입니다.");
                    } else if (ksa_now > ksa_endDate) {
                        alert("KSA하계CEO포럼 참가접수가 마감되었습니다.\n성원에 감사드립니다.");
                    } else {
                        window.location.href = event.target.href;
                    }
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
const current_year = 2025;
