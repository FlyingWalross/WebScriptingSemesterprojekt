<?php
include("appointments.php");

class MainLogic
{
    function handleRequest($method)
    {
        $this->sanitizePost();

        switch ($method) {
            case "getAppointments":
                $appointments = new AppointmentsLogic();
                return $appointments->getAppointments();
            default:
                return null;
        }
    }

    function sanitizePost(){
        foreach($_POST as $key => $value){
            $_POST[$key] = trim($_POST[$key]);
            $_POST[$key] = stripslashes($_POST[$key]);
            $_POST[$key] = htmlspecialchars($_POST[$key]);
        }
    }
}
