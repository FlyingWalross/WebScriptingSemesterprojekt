<?php
class AppointmentsLogic {

    private $dh;

    function __construct() {
       $this->dh = new DataHandler();
        }

    public function getAppointments(){
        return $this->dh->dataSelect("SELECT * from appointment where pk_appointment_id=?", [2], "i");
    }

}