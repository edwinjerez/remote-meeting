<?php
    define('HOST_NAME', 'localhost');
    define('USER_NAME', 'root');
    define('USER_PASS', '');
    define('TABLE_NAME', 'dktq');
    $con=mysqli_connect(HOST_NAME, USER_NAME, USER_PASS, TABLE_NAME);
    // Check connection
	if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    mysqli_set_charset($con,"utf8");
?>