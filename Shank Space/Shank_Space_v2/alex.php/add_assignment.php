<?php
$servername = "fdb12.awardspace.net";
$username = "2248270_school";
$password = "alexalexalex1";
$dbname = "2248270_school";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// get strings that was passed from GET URL
$class_id = $_REQUEST["class_id"];
$name = $_REQUEST["name"];
$notes = $_REQUEST["notes"];
$due_date = $_REQUEST["due_date"];
$priority = $_REQUEST["priority"];
$type = $_REQUEST["type"];


// create query
$sql = "INSERT INTO `Assignments`(`class_id`, `name`, `notes`, `due_date`, `priority`, `type`) VALUES ('" . $class_id . "','" . $name . "','" . $notes . "','" . $due_date . "','" . $priority . "','" . $type . "')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . $conn->error;
}

// Close connection
$conn->close();

?>