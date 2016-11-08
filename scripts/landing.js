//5
var animatePoints = function() {
    
    var revealPoint = function() {
        //7
         $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translate(0)'
         });
    };
 //6
    $.each($('.point'), reavealPoint);
};

$(window).load = (function() {
    if($(window).height() > 950){ //will automatically animate the points(selling-points) on a                                     taller screen where scrolling can't trigger the animation.
        animatePoint();
    }
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200; //tells scroll distance for                                                                                      animation
    $(window).scroll(function(event) {
        //console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels");
        if($(window).scrollTop() >= scrollDistance) {
            animatePoints();
        }
    });
});        
    