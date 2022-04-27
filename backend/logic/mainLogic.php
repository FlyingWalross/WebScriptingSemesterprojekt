<?php
require_once("models/appointments.php");
require_once("models/user_selections.php");

class MainLogic
{
    function handleRequest($method)
    {
       $this->sanitizePost();

        switch ($method) {
            case "getAppointments":
                return (new Appointments())->getAppointments();
            case "getAppointmentById":
                return (new Appointments())->getAppointmentById();
            case "createAppointment":
                return (new Appointments())->createAppointment();  
            case "getUserSelections":
                return (new User_Selections())->getUserSelections();
            case "createUserSelection":
                return (new User_Selections())->createUserSelection();
            default:
                return null;
        }
    }

    function sanitizePost(){
        foreach($_POST as $key => $value){                 
            if(is_array($value)){ //used to sanitize arrays that were passed as post parameters
                foreach($value as $key2 => $value2){
                    $value2 = trim($value2);
                    $value2 = stripslashes($value2);
                    $_POST[$key][$key2] = htmlspecialchars($value2);
                }
                return;
            }
            
            $value = trim($value);
            $value = stripslashes($value);
            $_POST[$key] = htmlspecialchars($value);
        }
    }
}
