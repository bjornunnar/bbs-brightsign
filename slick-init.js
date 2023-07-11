$(document).ready(function(){
    setTimeout(function(){
        $('.single-item').slick({
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 10000,
            arrows: false,
            fade: true,
            speed: 800
          });
    },1000); 
});
