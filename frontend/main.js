
$.ajaxSetup ({
    cache: false
});

$("#page").load("html/appointmentList.html");

window.onpopstate = function(){   
    $("#page").fadeOut("fast", function(){
        $("#page").load("html/appointmentList.html");
    });
};