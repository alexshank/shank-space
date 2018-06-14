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

// get string that was passed from GET URL
$keyword = $_REQUEST["keyword"];

// Select all matching classes
$query = "SELECT `id`, `google_user_id`, `name`, `notes`, `time` FROM `Classes` WHERE `google_user_id` LIKE '" . $keyword . "'";

if ($result=mysqli_query($conn,$query))
{

    // print JSON string of database results
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);

    // Free result set
    mysqli_free_result($result);
}

// Close connection
$conn->close();

?>