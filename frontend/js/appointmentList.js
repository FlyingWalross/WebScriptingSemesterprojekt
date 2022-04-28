
loadAppointments();

var clickedAppointmentId;

$("#createNewAppointmentButton").click(function(){  
    $("#page").fadeOut("fast", function(){
        $("#page").load("html/registerAppointment.html");
    });
  })

function loadAppointments(){
    $.ajax({
        type: "POST",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "getAppointments"},
        dataType: "json",
        success: insertAppointments,
        error: function (response) {
                alert("Request Error");
        },
    });
}

function insertAppointments(appointments){
    
    $.each(appointments, function(i, appointment) {

        newElement = document.createElement("tr");
        newElement.dataset.appointmentId = appointment["pk_appointment_id"];

        title = document.createElement("td");
        $(title).html(appointment["title"]);
        
        descritpion = document.createElement("td");
        $(descritpion).html(appointment["place"]);
        
        deadline = document.createElement("td");
        dateObj = new Date(appointment["deadline"]);
        dateString = dateObj.getDate() + "." + (dateObj.getMonth() + 1) + "." + dateObj.getFullYear() + " - " + ("0" + dateObj.getHours()).slice(-2) + ":" + ("0" + dateObj.getMinutes()).slice(-2);
        $(deadline).html(dateString);
        if(Date.now() > Math.floor(new Date(appointment["deadline"]).getTime())){
            $(deadline).html("<span style='color: blue;'> [Closed]</span>");
        }
        
        $(newElement).append(title);
        $(newElement).append(descritpion);
        $(newElement).append(deadline);

        $(newElement).on("click", clickAppointment);

        $("#appointmentsTable").append(newElement);
    });

    $("#page").fadeIn("fast");
}

function clickAppointment(){

    clickedAppointmentId = this.dataset.appointmentId;
    
    $("#page").fadeOut("fast", function(){
        $("#page").load("html/appointmentDetail.html");
    });
     
}