<?php

require_once("db/dataHandler.php");

class User_Selections {

    private $dh;

    function __construct() {
        $this->dh = new DataHandler();
        }

    public function getUserSelections(){
        if (empty($_POST["id"])){
            return null;
        }

        $userSelections = $this->dh->dataSelect("SELECT * from user_selection where fk_appointment_id=?", [$_POST["id"]], "i");

        foreach($userSelections as $key=>$selection){
            $selectedDates = $this->dh->dataSelect("SELECT * from user_selection_date where fk_selection_id=?", [$selection["pk_selection_id"]], "i");

            $selectedDateIds = [];
            
            foreach($selectedDates as $selectedDate){
                $selectedDateIds[] = $selectedDate["fk_date_id"];
            }
 
            $userSelections[$key]["selectedDateIds"] = $selectedDateIds;
        }

        return $userSelections;
    }

    public function createUserSelection(){
        if (empty($_POST["id"]) ||
            empty($_POST["username"]) ||
            strlen($_POST["username"]) > 200 ||
            (!empty($_POST["comment"]) && strlen($_POST["comment"]) > 200))
        {
            return null;
        }

        require_once("models/appointments.php");
        $appointment = (new Appointments())->getAppointmentById();

        if(empty($appointment)){
            return null;
        }
        
        if(!empty($_POST["dateIds"]) && !empty($_POST["dateIds"][0])){
            $appointmentDateIds = [];
            foreach($appointment["dates"] as $date){
                $appointmentDateIds[] = $date["pk_date_id"];
            }

            foreach($_POST["dateIds"] as $dateId){
                if(!in_array($dateId, $appointmentDateIds)){
                    echo "Test123";
                    return null;
                }
            }
        }

        empty($_POST["comment"]) ? $_POST["comment"] = null : false;

        $selectionId = $this->dh->dataInsert("INSERT INTO user_selection (fk_appointment_id, username, comment) VALUES (?, ?, ?)", [$_POST["id"], $_POST["username"], $_POST["comment"]], "iss");

        if(empty($selectionId)){
            return null;
        }

        if(!empty($_POST["dateIds"]) && !empty($_POST["dateIds"][0])){
            foreach($_POST["dateIds"] as $dateId){
                $this->dh->dataInsert("INSERT INTO user_selection_date (fk_selection_id, fk_date_id) VALUES (?, ?)", [$selectionId, $dateId], "ii");
            }
        }

        return $selectionId;
    }
}