var project_table;
var selected_project_id = null;
var playing = false;
var meeting_id = 'sj3j8d8n2';
var isClient = false;
var connection;
var videoMaxLengthInSeconds = 120;
var player = null;
var recorder;
var user_list = [];
var socket;

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
        $u_html += '<li><span>'+user_list[i].name+'</span><i class="fas fa-volume-up"></i></li>';
     }
    console.log(user_list, $u_html);
    $(".p-list").html($u_html);
}

$(document).ready( function() {
    $("#btn-record-start1").on('click', function() {
        // console.log('click');
        // player.record().start();
        // player.trigger('startRecord');
    });
    $("#btn-record-stop1").on('click', function() {
        // player.trigger('stopRecord');
        // player.record().stop();
    });

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

    connection = new RTCMultiConnection();

    // by default, socket.io server is assumed to be deployed on your own URL
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    connection.socketMessageEvent = 'audio-plus-screen-sharing-demo';

    socket = connection.getSocket();

    connection.session = {
        audio: 'two-way', // merely audio will be two-way, rest of the streams will be oneway
        // audio: true,
        video: false,
        screen: true,
        oneway: true,
    };

    connection.mediaConstraints = {
        audio: true,
        video: false
    };

    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    };

    if ( isClient ) {
        connection.extra = {
            fullName: prompt('Please enter your Full name!')
        };
    }

    connection.videosContainer = document.getElementById('videos-container');
    connection.audiosContainer = document.getElementById('audios-container');

    connection.onExtraDataUpdated = function( event ) {
        // console.log('onExtraDataUpdated', event, connection, connection.getAllParticipants());
        
        // console.log(connection.peers.getAllParticipants(), event);
    }

    // connection.onNumberOfBroadcastViewersUpdated = function(event) {
    //     console.log('onNumberOfBroadcastViewersUpdated', event);
    //     // event.broadcastId
    //     // event.numberOfBroadcastViewers
    //     console.log(event, 'Number of broadcast (', event.broadcastId, ') viewers', event.numberOfBroadcastViewers);
    // };

    // connection.onNewParticipant = function(participantId, userPreferences) {
    //     console.log('onNewParticipant', connection.getAllParticipants());
    // };

    connection.onmessage = function(event) {
        var message = event.data;
        console.log('onMessage', event);
        // if(message.shareYourCameraWithMe) {
        //     connection.dontAttachStream = false;
        //     connection.renegotiate(event.userid); // share only with single user
        // }
    
        // if(message.shareYourCameraWithAllUsers) {
        //     connection.dontAttachStream = false;
        //     connection.renegotiate(); // share with all users
        // }
    }
    connection.onUserStatusChanged = function(event) {
        if ( event.status == 'offline' ) {
            for (var i=0; i<user_list.length; i++ ) {
                if ( user_list[i].id == event.user_id ) {
                    user_list.splice(i, 1);
                    updateUserList();
                    return;
                }
            }
        }
        console.log('onUserStatusChanged', user_list);
    };
    connection.onstream = function(event) {
        

        console.log('onstream', event, 'Extra-----------------', event.extra);
        // if(event.type === 'remote' && !connection.session.video) {
        //     document.getElementById('btn-add-video').disabled = false;
        // }
        var options = {
            type: 'video',
            recorderType: MediaStreamRecorder,
            mimeType: 'video/webm'
        };
        if (event.mediaElement.nodeName.toLowerCase() == 'video') {
            recorder = RecordRTC(event.stream, options);
            console.log('RECORDER', recorder);
        }
        if ( !isClient ) {
            // event.mediaElement.muted = true;
        }
        var width = event.mediaElement.clientWidth || connection.videosContainer.clientWidth;
        var mediaElement = getMediaElement(event.mediaElement, {
            title: event.userid,
            buttons: ['full-screen', 'record-video', 'mute-audio', 'mute-video'],
            width: width,
            showOnMouseEnter: false,
            onRecordingStarted: function( type ) {
                console.log('recording started', event, connection);
                console.log('type', type);
                recorder.startRecording({
                    audio: true,
                    video: true,
                });
            },
            onRecordingStopped: function( type ) {
                console.log('recording stopped', type, recorder);
                recorder.stopRecording(function(singleWebM) {
                    recorder.save('1.webm');
                    // console.log(singleWebM, recorder.getBlob());
                    // var hyperlink = document.createElement('a');
                    // hyperlink.href = URL.createObjectURL(recorder.getBlob());
                    // console.log(hyperlink.href);
                    // hyperlink.download = 'aaa.webm';

                    // hyperlink.style = 'display:none;opacity:0;color:transparent;';
                    // (document.body || document.documentElement).appendChild(hyperlink);

                    // if (typeof hyperlink.click === 'function') {
                    //     hyperlink.click();
                    // } else {
                    //     hyperlink.target = '_blank';
                    //     hyperlink.dispatchEvent(new MouseEvent('click', {
                    //         view: window,
                    //         bubbles: true,
                    //         cancelable: true
                    //     }));
                    // }

                    // URL.revokeObjectURL(hyperlink.href);
                });
            }
        });

        console.log(mediaElement);
        if(event.stream.isScreen) {
            connection.videosContainer.appendChild(mediaElement);
        }
        else {
            connection.audiosContainer.appendChild(mediaElement);
        }

        setTimeout(function() {
            mediaElement.media.play();
        }, 5000);

        mediaElement.id = event.streamid;

    };

    connection.onstreamended = function(event) {
        console.log('onStreamEnded', event);
        // alert('StreamEnd');
        // var mediaElement = document.getElementById(event.streamid);
        // if(mediaElement) {
        //     mediaElement.parentNode.removeChild(mediaElement);
        // }
    };

    // document.getElementById('btn-add-video').onclick = function() {
    //     this.disabled = true;
    //     connection.session.video = true;
    //     connection.addStream({
    //         video: true,
    //         oneway: true
    //     });
    // };

    // Using getScreenId.js to capture screen from any domain
    // You do NOT need to deploy Chrome Extension YOUR-Self!!
    connection.getScreenConstraints = function(callback) {
        console.log('getScreenConstrants');
        getScreenConstraints(function(error, screen_constraints) {
            console.log(error, screen_constraints);
            if (!error) {
                screen_constraints = connection.modifyScreenConstraints(screen_constraints);
                console.log(error, screen_constraints);
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
    socket.on(connection.socketCustomEvent, function(message) {
        var user_name = message.name;
        var user_id = message.user_id;
        var status = message.status;
        console.log(message, user_name);
        
        if ( user_name ) {
            if ( status == 'online' ) {
                user_list.push({ 'id': user_id, 'name': user_name });
                updateUserList();
            }
        }
    });


    if( isClient && meeting_id && meeting_id.length) {
        localStorage.setItem(connection.socketMessageEvent, meeting_id);

        // auto-join-room
        (function reCheckRoomPresence() {
            connection.checkPresence(meeting_id, function(isRoomExists) {
                if(isRoomExists) {                   
                    socket.emit(connection.socketCustomEvent, { name: connection.extra.fullName, userid: connection.userid, status: 'online'});
                    connection.join(meeting_id);
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
        connection.open(meeting_id, function(isRoomCreated, roomid, error) {
            console.log('opened', isRoomCreated, roomid, error);
            // console.log('ssssssss');
            //showRoomURL(connection.sessionid);
        });
    });

    $(".sexytabs").tabs({ 
        show: { effect: "slide", direction: "left", duration: 200, easing: "easeOutBack" } ,
        hide: { effect: "slide", direction: "right", duration: 200, easing: "easeInQuad" } 
    });
    
    $(".dcm-btn").click(function() {
        toggleLeft('display-panel');
        $(".body-back").css('display', 'none');
        document.getElementById("frame-content").src = "http://www.decans.cn:3000/2c04ea71666ff20027dd9845baa0e0d5";
    });
    
    $(".stl-btn").click(function() {
        toggleLeft('display-panel');
        $(".body-back").css('display', 'none');
        document.getElementById("frame-content").src = "http://50.18.217.145/stl-operation/";
    })
    $(".display-btn").click(function() {
        toggleLeft('display-panel');
    });

    $(".control-btn").click(function() {
        toggleLeft('control-panel');
    });

    $(".record-btn").click(function() {
        toggleLeft('record-panel');
    });

    $(".btn-record-start").click(function() {
        console.log(connection.peers);
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
        closeDialog();
    })
    project_table = $("#project-table").DataTable({
        "paging":   true,
        "ordering": false,
        // "info":     false,
        "pageLength": 5,
        // "ajax": {
        //   "url": "./lib/loader.php",
        //   "type": "post",
        //   "data": {
        //     type: 'projects'
        //   },
        //   "dataSrc": function(res) {
        //     var return_data = new Array();
        //     for(var i=0; i<res.length; i++) {
        //       projects_array.push({
        //         "id": res[i].id,
        //         "project_name": res[i].project_name,
        //         "dicom_id": res[i].dicom_id,
        //         "path": res[i].path,
        //         "create_time": res[i].create_time
        //       });
        //       return_data.push({
        //         "no": (i+1),
        //         "project_name": res[i].project_name,
        //         "create_time": res[i].create_time
        //       });
        //     }
        //     return return_data;
        //   }
        // },
        "columns": [
          { 'data': 'no'},
          { 'data': 'project_name'},
          { 'data': 'create_time'},
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
        var index = $(this)[0].sectionRowIndex;
        selected_project_id = 5 * project_table.page.info().page + index;
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
})