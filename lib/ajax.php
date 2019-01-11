<?php

    function generateRandomString($length = 32) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

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
    } else if ( $type == 'get-dcm-stl' ) {
        $user_id = $_POST['user_id'];
        $sql = 'select * from dicom where user_id='.$user_id;
        if ( $result = mysqli_query($con, $sql) ) {
            $dcm_stl_arr = array();
            while ( $row = mysqli_fetch_assoc($result) ) {
                if ($row['file_info']) {
                    $uid = json_decode($row['file_info'])[0]->uid;
                    $tmp_id = generateRandomString();
                    $dicom_path = '/api/static/dicom/'.$uid.'/dicom_files';
                    $stl_path = $row['model']!=NULL ? '/api/'.$row['model'] : '';
                    $expiry_date = time() + 5*60*60;
                    array_push($dcm_stl_arr, [ 'dicomname' => $row['dicomname'], 'tmpID' => $tmp_id, 'userID' => $user_id, 'uid' => $uid, 'stl_path' => $stl_path, 'dicom_path' => $dicom_path ]);
                    $sql1 = "insert into tmpinfo(tmpID, userID, uid, stl_path, dicom_path, expiry_date) VALUES('".$tmp_id."', '".$user_id."', '".$uid."', '".$stl_path."', '".$dicom_path."', '".$expiry_date."')";
                    mysqli_query($con, $sql1);
                }
            }
            echo json_encode($dcm_stl_arr);
        }

    }
?>