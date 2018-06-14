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
$user_id = $_REQUEST["user_id"];
$first = $_REQUEST["first"];
$last = $_REQUEST["last"];


// create query
$sql = "INSERT INTO `Users`(`google_id`, `first_name`, `last_name`) VALUES ('" . $user_id . "','" . $first . "','" . $last . "')";

if ($conn->query($sql) === TRUE) {
    echo "User added successfully";
} else {
    echo "Error: " . $sql . $conn->error;
}

// Close connection
$conn->close();

?>