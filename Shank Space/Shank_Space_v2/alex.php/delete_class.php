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

// create query
$sql = "DELETE FROM `Classes` WHERE `id` LIKE '" . $class_id . "'";

if ($conn->query($sql) === TRUE) {
    echo "Class was removed successfully";
} else {
    echo "Error: " . $sql . $conn->error;
}

// Close connection
$conn->close();

?>