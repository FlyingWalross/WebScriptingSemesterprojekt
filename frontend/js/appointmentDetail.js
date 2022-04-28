
window.history.pushState("appointmentState","");

$("#returnToAppointmentListButton").click(function(){
    history.back();
  })

$("#submitSelectionButton").click(submitSelection);

loadAppointmentwithId(clickedAppointmentId);

function loadAppointmentwithId(appointmentId){
    $.ajax({
        type: "POST",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "getAppointmentById", id: appointmentId},
        dataType: "json",
        success: displayAppointment,
        error: function (response) {
                alert("Request Error");
        },
    });

}

function displayAppointment(appointment){
    $("#appointmentTitle").html(appointment["title"]);
    $("#appointmentDescription").html(appointment["place"]);

    if(Date.now() < Math.floor(new Date(appointment["deadline"]).getTime())){

        $("#userSelections").append('<tr class="table-primary" id="selectDatesRow"><th style="max-width:100%; white-space:nowrap;">Select dates: </th><td></td></tr>');

        $.each(appointment["dates"], function(i, date) {
            newElement = document.createElement("td");
            $(newElement).html('<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="dateSelector" data-date-id=' + date["pk_date_id"] + '></div>');
            $(newElement).insertBefore("#selectDatesRow td:last");
        });
    } else {
        $("#appointmentTitle").html(appointment["title"] + "<span style='color: blue;'> [Closed]</span>");
        $("#nameInput").hide();
        $("#commentInput").hide();
        $("#submitSelectionButton").hide();
    }

    $.each(appointment["dates"], function(i, date) {
        newElement = document.createElement("th");
        $(newElement).attr("scope", "col");
        $(newElement).html(date["time"]);
        newElement.dataset.dateId = date["pk_date_id"];
        $(newElement).attr("class", "dateColum");
        $(newElement).insertBefore("#tableDateColumns th:last");
    });



    loadUserSelections(clickedAppointmentId);
}

function loadUserSelections(appointmentId){
    $.ajax({
        type: "POST",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "getUserSelections", id: appointmentId},
        dataType: "json",
        success: displayUserSelections,
        error: function (response) {
                alert("Request Error");
        },
    });
}

function displayUserSelections(selections){

    if(selections != "no selections"){
        $.each(selections, function(i, selection){
            newElement = document.createElement("tr");
            $(newElement).append('<th style="max-width:100%; white-space:nowrap;">' + selection["username"] + '</th>');
            
            
            $(".dateColum").each(function(i, dateColum) {          
                if(selection["selectedDateIds"].includes(parseInt(dateColum.dataset.dateId))){
                    $(newElement).append('<td><span style="color: green;">&#10003;</span></td>');       
                }else{
                    $(newElement).append('<td><span style="color: red;">&#10007;</span></td>'); 
                }
            });
    
            if(selection["comment"] != null){
                $(newElement).append('<td style="max-width:100%; white-space:nowrap;">' + selection["comment"] + '</td>');
            }else{
                $(newElement).append('<td style="max-width:100%; white-space:nowrap;"></td>');
            }
            
            $("#userSelections").append(newElement);
        });
    }

    $("#page").fadeIn("fast");
}  

function submitSelection(){

    if(!$("#nameInput").val()){
        $("#noNameWarning").html("Please enter a name!");
        return;
    }

    selectedDateIds = [];

    $("input[id='dateSelector']").each(function(i, dateSelector) {          
        if($(dateSelector).is(':checked')){
            selectedDateIds.push(dateSelector.dataset.dateId);
        }
    });

    $.ajax({
        type: "POST",
        url: "../backend/serviceHandler.php",
        cache: false,
        data: {method: "createUserSelection", id: clickedAppointmentId, username: $("#nameInput").val(), comment: $("#commentInput").val(), dateIds: selectedDateIds},
        dataType: "json",
        success: reloadPage,
        error: function (response) {
                alert("Request Error");
        },
    });
}

function reloadPage(){
    $("#page").fadeOut("fast", function(){
        $("#page").load("html/appointmentDetail.html");
    }); 
}
