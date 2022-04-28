<?php

require_once("db/dataHandler.php");

class Appointments {

    private $dh;

    function __construct() {
        $this->dh = new DataHandler();
        }

    public function getAppointments(){
        $appointments = $this->dh->dataSelect("SELECT * from appointment ORDER BY deadline DESC");

        foreach($appointments as $key=>$appointment){
            $appointmentDates = $this->dh->dataSelect("SELECT pk_date_id, time from date where fk_appointment_id=?", [$appointment["pk_appointment_id"]], "i");
 
            $appointments[$key]["dates"] = $appointmentDates;
        }

        return $appointments;
    }

    public function getAppointmentById(){
        if (empty($_POST["id"])){
            return null;
        }
        $appointment = $this->dh->dataSelect("SELECT * from appointment where pk_appointment_id=?", [$_POST["id"]], "i");
        if(empty($appointment)){
            return null;
        }
        $appointment = $appointment[0];

        $appointment["dates"] = $this->dh->dataSelect("SELECT pk_date_id, time from date where fk_appointment_id=?", [$appointment["pk_appointment_id"]], "i");
    
        return $appointment;
    }

    public function createAppointment(){
        if (empty($_POST["title"]) ||
            empty($_POST["deadline"]) ||
            strlen($_POST["title"]) > 200 ||
            (!empty($_POST["place"]) && strlen($_POST["place"]) > 200)||
            empty($_POST["dates"]))
        {
            return null;
        }

        empty($_POST["place"]) ? $_POST["place"] = null : false;

        $AppointmentId = $this->dh->dataInsert("INSERT INTO appointment (title, place, deadline) VALUES (?, ?, FROM_UNIXTIME(?))", [$_POST["title"], $_POST["place"], $_POST["deadline"]], "ssi");

        if(empty($AppointmentId)){
            return null;
        }

        foreach($_POST["dates"] as $dateTime){
            $this->dh->dataInsert("INSERT INTO date (fk_appointment_id, time) VALUES (?, FROM_UNIXTIME(?))", [$AppointmentId, $dateTime], "ii");
        }

        $_POST["id"] = $AppointmentId;
        return $this->getAppointmentById();
    }
}