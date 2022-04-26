<?php
class Appointment {
    public $id;
    public $title;
    public $place;
    public $deadline;

    function __construct($id, $title, $place, $deadline) {
        $this->id = $id;
        $this->title = $title;
        $this->place = $place;
        $this->deadline = $deadline;
      }
}
