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
var audio_streams = [];
var projects_array = [];

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

    screenConnection = new RTCMultiConnection();
    audioConnection = new RTCMultiConnection();
    
    // by default, socket.io server is assumed to be deployed on your own URL
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    screenConnection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    audioConnection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    // comment-out below line if you do not have your own socket.io server
    // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

    screenConnection.socketMessageEvent = audioConnection.socketMessageEvent = 'audio-plus-screen-sharing-demo';

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
        screenConnection.extra = {
            fullName: prompt('Please enter your Full name!')
        };
    }

    screenConnection.videosContainer = document.getElementById('videos-container');
    audioConnection.audiosContainer = document.getElementById('audios-container');

    screenConnection.onUserStatusChanged = function(event) {
        console.log('onUserStatusChanged', event);
        if ( event.status == 'offline' ) {
            for (var i=0; i<user_list.length; i++ ) {
                if ( user_list[i].id == event.userid ) {
                    // console.log('slice', i);
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
        audio_streams.push(event.stream);
    };

    screenConnection.onstream = function(event) {
        console.log('onstream', event, 'Extra-----------------', event.extra);

        var options = {
            type: 'video',
            // recorderType: MediaStreamRecorder,
            // mimeType: 'video/webm'
        };
        
        recorder = RecordRTC([event.stream], options);

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
                recorder.startRecording();
                var i_recorder = recorder.getInternalRecorder();
                i_recorder.addStreams(audio_streams);
                
            },
            onRecordingStopped: function( type ) {
                console.log('recording stopped', type, recorder);
                recorder.stopRecording(function(singleWebM) {
                    recorder.save('1.webm');
                });
            }
        });

        console.log(mediaElement);
        if(event.stream.isScreen) {
            screenConnection.videosContainer.appendChild(mediaElement);
        }
        else {
            screenConnection.audiosContainer.appendChild(mediaElement);
        }

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
        var user_name = message.name;
        var user_id = message.userid;
        var status = message.status;
        // console.log(message, user_name);
        
        if ( user_name ) {
            if ( status == 'online' ) {
                user_list.push({ 'id': user_id, 'name': user_name });
                updateUserList();
            }
        }
    });


    if( isClient && meeting_id && meeting_id.length) {
        localStorage.setItem(screenConnection.socketMessageEvent, meeting_id);

        // auto-join-room
        (function reCheckRoomPresence() {
            screenConnection.checkPresence(meeting_id, function(isRoomExists) {
                if(isRoomExists) {                   
                    socket.emit(screenConnection.socketCustomEvent, { name: screenConnection.extra.fullName, userid: screenConnection.userid, status: 'online'});
                    screenConnection.join(meeting_id);
                    audioConnection.join(meeting_id + 'audio');
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
        audioConnection.open(meeting_id + 'audio', function(isRoomCreated, roomid, error) {
            console.log('audio_opened', isRoomCreated, roomid, error);
        });
    });

    $(".sexytabs").tabs({ 
        show: { effect: "slide", direction: "left", duration: 200, easing: "easeOutBack" },
        hide: { effect: "slide", direction: "right", duration: 200, easing: "easeInQuad" } 
    });
    
    $(".dcm-btn").click(function() {
        toggleLeft('display-panel');
        $(".body-back").css('display', 'none');
        document.getElementById("frame-content").src = "https://www.decans.cn:3000/2c04ea71666ff20027dd9845baa0e0d5";
    });
    
    $(".stl-btn").click(function() {
        toggleLeft('display-panel');
        $(".body-back").css('display', 'none');
        document.getElementById("frame-content").src = "https://www.decans.cn/stl-operation/";
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
        console.log(screenConnection.peers);
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
})