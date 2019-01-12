var project_table;
var selected_project_id = null;
var playing = false;
var meeting_id = '';
var user_id = 1;
var isClient = false;
var screenConnection;
var audioConnection;

var videoMaxLengthInSeconds = 120;
var player = null;
var recorder;
var user_list = [];
var socket;
var media_streams = [];
var projects_array = [];
var isSpeakerOn = true;
var isOwnerRecording = false;

window.enableAdapter = true; // enable adapter.js

console.log(DetectRTC);
function closeDialog() {
    project_table.page( 'first' ).draw('page');
    $("#project-table tr").removeClass("selected");
    selected_project_id = null;
    $("#modal_projects").css("display",'none');
}

function toggleLeft( $cls, $isHide = false) {
    $(".darkpage").css('left', '-255px');
    if ( $isHide ) {
        $('.' + $cls).css('left', '-255px');
        return;
    }
    if ( $('.' + $cls).css('left') == '170px' ) {
        $('.' + $cls).css('left', '-255px');
    } else {
        $('.' + $cls).css('left', '170px');
    }
}

function updateUserList() {
    $u_html = '';
    for(var i=0; i<user_list.length; i++) {
        $u_html += '<li><span>'+user_list[i].name+'</span><a class="user-mute" data-user-index="'+i+'" data-user-id="'+user_list[i].id+'"><i class="fas fa-volume-up"></i></a></li>';
     }
    $(".p-list").html($u_html);

    $(".user-mute").click(function() {
        $u_index = $(this).data('user-index');
        $audio_index = getStreamIndexByStreamId(user_list[$u_index].stream_id);
        if ( user_list[$u_index].isMuted ) {
            $(this).html('<i class="fas fa-volume-up"></i>');
        } else {
            $(this).html('<i class="fas fa-volume-mute"></i>');
        }
        media_streams[$audio_index].getAudioTracks()[0].enabled = !media_streams[$audio_index].getAudioTracks()[0].enabled;
        user_list[$u_index].isMuted = !user_list[$u_index].isMuted;

    });
}

function getStreamIndexByStreamId( stream_id ) {
    for ( var i=0; i<media_streams.length; i++ ) {
        if ( media_streams[i].streamid == stream_id ) {
            return i;
        }
    }
}

$(document).ready( function() {
    // ......................................................
    // ..................RTCMultiConnection Code.............
    // ......................................................
    (function() {
        var params = {},
            r = /([^&=]+)=?([^&]*)/g;

        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }
        var match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[d(match[1])] = d(match[2]);
        window.params = params;
        if ( params['room_id'] ) {
            meeting_id = params['room_id'];
            isClient = true;
            $(".owner-content").css('display', 'none');
        } else {
            $(".owner-content").css('display', 'block');
            $(".client-content").css('display', 'none');
        }
    })();

    screenConnection = new RTCMultiConnection();
    audioConnection = new RTCMultiConnection();
    
    // by default, socket.io server is assumed to be deployed on your own URL
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    screenConnection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    audioConnection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    screenConnection.socketMessageEvent = 'audio-plus-screen-sharing-demo';
    audioConnection.socketMessageEvent = 'audio-plus-screen-sharing-demo';

    socket = screenConnection.getSocket();

    screenConnection.session = {
        screen: true,
        oneway: true,
    };

    audioConnection.session = {
        audio: true,
        video: false
    };

    screenConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };

    audioConnection.mediaConstraints = {
        audio: true,
        video: false
    };
    
    audioConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    };

    if ( isClient ) {
        audioConnection.extra = {
            fullName: prompt('Please enter your Full name!')
        };
    }

    screenConnection.videosContainer = document.getElementById('videos-container');
    audioConnection.audiosContainer = document.getElementById('audios-container');


    audioConnection.onUserStatusChanged = function(event) {
        console.log('onUserStatusChanged', event);
        if ( event.status == 'offline' ) {
            for (var i=0; i<user_list.length; i++ ) {
                if ( user_list[i].id == event.userid ) {
                    // console.log('slice', i);
                    var stream_index = getStreamIndexByStreamId(event.stream_id);
                    media_streams.splice(stream_index, 1);
                    user_list.splice(i, 1);
                    updateUserList();
                    return;
                }
            }
        }
        // console.log('onUserStatusChanged', user_list);
    };

    audioConnection.onstream = function (event) {
        console.log('onAudiostream', event);
        var user_name = event.extra.fullName;
        var user_id = event.userid;
        
        if ( user_name ) {
            user_list.push({ 'id': user_id, 'name': user_name, 'isMuted': false, 'stream_id': event.streamid });
            updateUserList();
        }

        media_streams.push(event.stream);
        console.log(event.stream.getAudioTracks()[0].enabled)
        var width = event.mediaElement.clientWidth || audioConnection.audiosContainer.clientWidth;

        var mediaElement = getMediaElement(event.mediaElement, {
            title: event.userid,
            buttons: ['full-screen', 'mute-audio', 'mute-video'],
            width: width,
            showOnMouseEnter: false,

        });
        audioConnection.audiosContainer.appendChild(mediaElement);
    };

    screenConnection.onstream = function(event) {
        console.log('onstream', event, 'Extra-----------------', event.extra);

        media_streams.push(event.stream);

        if ( !isClient ) {
            // event.mediaElement.muted = true;
        }
        var width = event.mediaElement.clientWidth || screenConnection.videosContainer.clientWidth;
        var mediaElement = getMediaElement(event.mediaElement, {
            title: event.userid,
            buttons: ['full-screen', 'record-video', 'mute-audio', 'mute-video'],
            width: width,
            showOnMouseEnter: false,
            onRecordingStarted: function( type ) {
                console.log('recording started', event, screenConnection);
                var options = {
                    type: 'video',
                    video: {
                        width: 1280,
                        height: 720
                    }
                    // recorderType: MediaStreamRecorder,
                    // mimeType: 'video/webm'
                };
                if (recorder) recorder = null
                recorder = RecordRTC(media_streams, options);
                recorder.startRecording();
                var i_recorder = recorder.getInternalRecorder();
                if (i_recorder instanceof MultiStreamRecorder) {
                    console.log('aaaaaaaaaaaaaaaaaaaaaaaaa');
                    i_recorder.addStreams(media_streams);
                }
                
            },
            onRecordingStopped: function( type ) {
                console.log('recording stopped', type, recorder);
                recorder.stopRecording(function(singleWebM) {
                    recorder.save();
                });
            }
        });

        console.log(mediaElement);
        // if(event.stream.isScreen) {
            screenConnection.videosContainer.appendChild(mediaElement);
        // }
        // else {

        // }

        setTimeout(function() {
            mediaElement.media.play();
        }, 5000);

        mediaElement.id = event.streamid;

    };

    screenConnection.onstreamended = function(event) {
        console.log('onScreenStreamEnded', event);
    };

    // Using getScreenId.js to capture screen from any domain
    // You do NOT need to deploy Chrome Extension YOUR-Self!!
    screenConnection.getScreenConstraints = function(callback) {
        getScreenConstraints(function(error, screen_constraints) {
            if (!error) {
                screen_constraints = screenConnection.modifyScreenConstraints(screen_constraints);
                console.log(screen_constraints);
                callback(error, screen_constraints);
                return;
            }
            playing = false; // playing = true;
            var animation = playing ? 'stop' : 'play';
            $('#animate_to_' + animation).get(0).beginElement();
            $('#animate1_to_' + animation).get(0).beginElement();         
            throw error;
        });
    };

    // console.log(meeting_id);

    // on user add
    socket.on(screenConnection.socketCustomEvent, function(message) {
        // var user_name = message.name;
        // var user_id = message.userid;
        // var status = message.status;
        // // console.log(message, user_name);
        
        // if ( user_name ) {
        //     if ( status == 'online' ) {
        //         user_list.push({ 'id': user_id, 'name': user_name, 'isMuted': false });
        //         updateUserList();
        //     }
        // }
    });


    if( isClient && meeting_id && meeting_id.length) {
        localStorage.setItem(screenConnection.socketMessageEvent, meeting_id);

        // auto-join-room
        (function reCheckRoomPresence() {
            screenConnection.checkPresence(meeting_id, function(isRoomExists) {
                if(isRoomExists) {                   
                    socket.emit(screenConnection.socketCustomEvent, { name: audioConnection.extra.fullName, userid: screenConnection.userid, status: 'online'});
                    screenConnection.join(meeting_id);
                    audioConnection.join('a' + meeting_id);
                    return;
                }
                setTimeout(reCheckRoomPresence, 5000);
            });
        })();

        // disableInputButtons();
    }
    // document.getElementById("frame-content").src = "http://www.decans.cn/stl-operation/";
    // $("#frame-content").src = "http://www.decans.cn/stl-operation/";
    $height = window.innerHeight - 56;
    $(".nice-nav").css('height', $height + 'px');
    $(".body-part").css('height', ($height - 3) + 'px');
    $(".body-back").css('height', $height + 'px');
    $(".embed-back").css('height', $height + 56 + 'px');

    $('svg').click(function() {
        if ( playing ) 
            return;
        playing = true; // playing = true;
        var animation = playing ? 'stop' : 'play';
        $('#animate_to_' + animation).get(0).beginElement();
        $('#animate1_to_' + animation).get(0).beginElement();
        console.log(meeting_id);
        screenConnection.open(meeting_id, function(isRoomCreated, roomid, error) {
            console.log('opened', isRoomCreated, roomid, error);
            // console.log('ssssssss');
            //showRoomURL(connection.sessionid);
        });
        function openAudioConnection() {
            audioConnection.open('a' + meeting_id, function(isRoomCreated, roomid, error) {
                console.log('audio_opened', isRoomCreated, roomid, error);
                if ( !isRoomCreated ) {
                    audioConnection.checkPresence('a' + meeting_id, function(isRoomExists) {
                        console.log('DDDDDDDDDDD', isRoomExists);
                    });
                    // openAudioConnection();
                }
            });
        }
        setTimeout(openAudioConnection, 1000);
        
    });

    $(".sexytabs").tabs({ 
        show: { effect: "slide", direction: "left", duration: 200, easing: "easeOutBack" },
        hide: { effect: "slide", direction: "right", duration: 200, easing: "easeInQuad" } 
    });
    
    $(".display-btn").click(function() {
        toggleLeft('display-panel');
    });

    $(".control-btn").click(function() {
        toggleLeft('control-panel');
    });

    $(".record-btn").click(function() {
        toggleLeft('record-panel');
    });

    $(".btn-record").click(function() {
        if ( user_list.length == 0 )
            return;

        isOwnerRecording = !isOwnerRecording;
        if ( isOwnerRecording ) { // recording started
            $(this).html('<i class="fas fa-stop"></i>');
            var options = {
                type: 'video',
                video: {
                    width: 1280,
                    height: 720
                },
                recorderType: MediaStreamRecorder,
                // mimeType: 'video/webm'
            };
            if (recorder) recorder = null
            recorder = RecordRTC(media_streams, options);
            recorder.startRecording();
            var i_recorder = recorder.getInternalRecorder();
            if (i_recorder instanceof MultiStreamRecorder) {
                i_recorder.addStreams(media_streams);
            }
        } else { // recording stopped
            $(this).html('<i class="fas fa-play"></i>');
            recorder.stopRecording(function(singleWebM) {
                recorder.save();
            });
        }
        // media_streams
        // connection.join('sj3j8d8n2');
    })

    $("a.toggle-nav").click(function() {
        // toggle left bar
        if ( $(".nice-nav").css('left') == '0px' )  {
            $(".nice-nav").css('left', '-160px');
            toggleLeft('darkpage', true);
            $(".body-part").css('width', '100%');
            $(".body-part").css('margin-left', '0px');
        }  else {
            $(".nice-nav").css('left', '0px');
            $(".body-part").css('width', "calc( 100% - 160px )");
            $(".body-part").css('margin-left', '160px');
        }
    });

    $(".load-project-btn").on('click', function() {
        if ( selected_project_id == null ) {
            swal({
                title: "No Project!",
                text: "Please select a project!",
                type: "error",
                background: '#000',
                showConfirmButton: false,
              });
            return;
        }
        $.ajax({
            "url": "./lib/ajax.php",
            "type": "post",
            "data": {
                type: 'get-dcm-stl',
                user_id: user_id
            },
            success: function(res) {
                var dcm_stl_arr = JSON.parse(res);
                console.log(dcm_stl_arr);
                var u_html = '';
                for(var i=0; i<dcm_stl_arr.length; i++) {
                    u_html += "<li><div class='media-body'><span>"+dcm_stl_arr[i].dicomname+"</span></div><div class='media-right'><button data-dicom-path='"+dcm_stl_arr[i].dicom_path+"' data-tmpid='"+dcm_stl_arr[i].tmpID+"' class='button dcm-btn'>Dcm Viewer</button></div>";
                    if ( dcm_stl_arr[i].stl_path ) {
                        u_html += "<li><div class='media-body'><span>"+dcm_stl_arr[i].dicomname+"</span></div><div class='media-right'><button data-stl-path='"+dcm_stl_arr[i].stl_path+"' class='button stl-btn'>Stl Viewer</button></div>";
                    }
                    // projects_array.push({
                    //     "id": res[i].remote_id,
                    //     "project_name": res[i].name,
                    //     "meeting_id": res[i].meeting_id,
                    //     "username": res[i].username,
                    //     "user_id": res[i].user_id
                    // });
                }
                $(".dcm-list").html(u_html);

                //event for button
                $(".dcm-btn").click(function() {
                    $tmpID = $(this).data('tmpid');
                    console.log($tmpID);
                    toggleLeft('display-panel');
                    $(".body-back").css('display', 'none');
                    document.getElementById("frame-content").src = "https://www.decans.cn:3000/" + $tmpID;
                });
                
                $(".stl-btn").click(function() {
                    $stl_path = $(this).data('stl-path');
                    setCookie('stl_path', '..' + $stl_path);
                    toggleLeft('display-panel');
                    $(".body-back").css('display', 'none');
                    document.getElementById("frame-content").src = "https://www.decans.cn/stl-operation/";
                })
          }
        });
        closeDialog();
    })
    project_table = $("#project-table").DataTable({
        "paging":   true,
        "ordering": false,
        // "info":     false,
        "pageLength": 5,
        "ajax": {
          "url": "./lib/ajax.php",
          "type": "post",
          "data": {
            type: 'projects',
            user_id: user_id
          },
          "dataSrc": function(res) {
            var return_data = new Array();
            for(var i=0; i<res.length; i++) {
              projects_array.push({
                "id": res[i].remote_id,
                "project_name": res[i].name,
                "meeting_id": res[i].meeting_id,
                "username": res[i].username,
                "user_id": res[i].user_id
              });
              return_data.push({
                "no": (i+1),
                "owner_name": res[i].username,
                "meeting_id": res[i].meeting_id,
                "project_name": res[i].name
              });
            }
            return return_data;
          }
        },
        "columns": [
          { 'data': 'no' },
          { 'data': 'owner_name' },
          { 'data': 'meeting_id' },
          { 'data': 'project_name' },
          ],
        "bFilter":true,
        // "rowClickHandler": onParentTable
      });


    $("#project-table").on( 'page.dt', function() {
        $("#project-table tr").removeClass("selected");
        selected_project_id = null;
        // var info = project_table.page.info();
    });

    $('#project-table tbody').on( 'click', 'tr', function (event) {
        selected_project_id = $(this).children('td:eq(2)').text();
        meeting_id = selected_project_id;
        // var index = $(this)[0].sectionRowIndex;
        // selected_project_id = 5 * project_table.page.info().page + index;
        $("#project-table tr").removeClass("selected");
        $(this).toggleClass('selected');
    });

    if ( !isClient ) {
        $("#modal_projects").css("display",'block');
    }

    $(".cancel-project-btn").click( function() {
        location.href = 'https://www.decans.cn';
    })
    window.onclick = function(event) {
        if (event.target == document.getElementById("frame-content") || event.target == document.getElementsByClassName("body-back")[0] ) {
            $(".darkpage").css('left', '-255px');
        }
    };

    $(".microphone-mute-owner").on('click', function() {
        if ( media_streams.length > 0 ) {
            media_streams[0].getAudioTracks()[0].enabled = !media_streams[0].getAudioTracks()[0].enabled;
            if ( media_streams[0].getAudioTracks()[0].enabled ) {
                $(this).html('<i class="fas fa-microphone"></i>');
            } else {
                $(this).html('<i class="fas fa-microphone-slash"></i>');
            }
        }
    });

    $(".speaker-mute-owner").on('click', function() {
        if ( media_streams.length > 0 ) {
            isSpeakerOn = !isSpeakerOn;
            if ( isSpeakerOn ) {
                $(this).html('<i class="fas fa-volume-up"></i>');
            } else {
                $(this).html('<i class="fas fa-volume-mute"></i>');
            }
        }
    })
})