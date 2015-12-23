$(document).ready(function(){
    // scroll to top
    $("#scroll-topper").hide();
    $("#scroll-topper").click(function(){
	$("html, body").animate({ scrollTop: 0 }, 600);
    });
    $('body').scrollspy({ target: '#scrollspysiderbar', offset:80 });
});


// show scroller
$(window).scroll(function(){
    if ($(this).scrollTop() > 100) {
        $("#scroll-topper").fadeIn();
    } else {
        $("#scroll-topper").fadeOut();
    }
});
