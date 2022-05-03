$(window).on('load', function () {
    $(".loader").fadeOut(1500);
    $(".content").fadeIn(1500);
});

setTimeout(function () { 
    window.location.href = '/home'; }, 1500);