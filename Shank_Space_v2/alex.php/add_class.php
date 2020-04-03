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
$google_id = $_REQUEST["google_id"];
$name = $_REQUEST["name"];
$notes = $_REQUEST["notes"];
$time = $_REQUEST["time"];

// create query
$sql = "INSERT INTO `Classes`(`google_user_id`, `name`, `notes`, `time`) VALUES (" . $google_id . ",'" . $name . "','" . $notes . "','" . $time . "')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . $conn->error;
}

// Close connection
$conn->close();

?>