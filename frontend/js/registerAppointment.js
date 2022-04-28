
window.history.pushState("appointmentState","");

$("#cancelRegisterAppointmentButton").click(function(){
  history.back();
    })

selectedDates = [];

$('#addDateButton').click(addDate);

function addDate(){
    if(!$('#dateOptionInput').val()){
        return;
    }

    newDateUnixTime = new Date($('#dateOptionInput').val()).getTime() / 1000;

    if(selectedDates.includes(newDateUnixTime)){
        return;
    }

    selectedDates.push(newDateUnixTime);
    selectedDates.sort();

    $('#dateOptionsList').empty();

    $.each(selectedDates, function(i, date){
        dateObj = new Date(date * 1000);
        dateString = dateObj.getDate() + "." + (dateObj.getMonth() + 1) + "." + dateObj.getFullYear() + " - " + ("0" + dateObj.getHours()).slice(-2) + ":" + ("0" + dateObj.getMinutes()).slice(-2);
        $('#dateOptionsList').append('<li class="list-group-item list-group-item-action">' + dateString + '<button type="button" class="btn btn-secondary" style="font-size: 15px; float: right; padding: 2px 7px 2px 7px;">X</button></li>');
        $('ul button:last').click(function(){ $(this).parent().remove(); removeDate(date); });
    });
}

function removeDate(dateUnixTime){
    index = selectedDates.indexOf(dateUnixTime);
    selectedDates.splice(index, 1);
}

$('#createAppointmentButton').click(createAppointment);

function createAppointment(){

    if(!$('#titleInput').val()){
        $("#missingFormdataWarning").html("Please enter a title!");
        return;
    }

    if(!$('#deadlineInput').val()){
        $("#missingFormdataWarning").html("Please set a deadline!");
        return;
    }

    if(!selectedDates.length){
        $("#missingFormdataWarning").html("Please add a date!");
        console.log("test");
        return;
    }
    
    deadlineUnixTime = new Date($('#deadlineInput').val()).getTime() / 1000;

    $.ajax({
        type: "POST",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "createAppointment", title: $('#titleInput').val(), deadline: deadlineUnixTime, place: $("#descriptionInput").val(), dates: selectedDates},
        dataType: "json",
        success: goToAppointment,
        error: function (response) {
                alert("Request Error");
        },
    });

}

function goToAppointment(appointment){
    
    clickedAppointmentId = appointment["pk_appointment_id"];
    
    $("#page").fadeOut("fast", function(){
        $("#page").load("html/appointmentDetail.html");
    });
}

$("#page").fadeIn("fast");