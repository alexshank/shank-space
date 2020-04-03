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
$assignment_id = $_REQUEST["assignment_id"];

// create query
$sql = "DELETE FROM `Assignments` WHERE `id` LIKE '" . $assignment_id . "'";

if ($conn->query($sql) === TRUE) {
    echo "Assignment was removed successfully";
} else {
    echo "Error: " . $sql . $conn->error;
}

// Close connection
$conn->close();

?>