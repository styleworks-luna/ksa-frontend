$.ajax({
    type: "GET",
    url: "https://api-koita2023.onoffmix.xyz/api/v1/galleries/all",
    success: function (response) {
        $.each(response, function (response, item) {
            $(".gallery-swiper").append('<div class="swiper-slide"><img src="https://api-koita2023.onoffmix.xyz/' + item.image.fileUri + '" alt="' +  item.image.originalFileName + '"></div">');
        });
    },
    error: function (xhr, status, error) {
        alert(error);
    }
});