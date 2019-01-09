<?php
    include_once("db.php");
    $type = $_POST['type'];
    if ( $type == 'projects' ) {
        $user_id = $_POST['user_id'];
        $sql = "select remote_meeting.id as remote_id, user_id, meeting_id, name, user.username as username from remote_meeting LEFT JOIN user on user.id = remote_meeting.user_id where user_id = ".$user_id;
        if ( $result = mysqli_query($con, $sql) ) {
            $remote_projects = array();
            while ( $row = mysqli_fetch_assoc($result) ) {
                array_push($remote_projects, $row);
            }
            echo json_encode($remote_projects);
        }
    }
?>