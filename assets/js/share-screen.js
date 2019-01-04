// ......................................................
// ..................RTCMultiConnection Code.............
// ......................................................

var connection = new RTCMultiConnection();

// by default, socket.io server is assumed to be deployed on your own URL
connection.socketURL = '/';

// comment-out below line if you do not have your own socket.io server
// connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

connection.socketMessageEvent = 'audio-plus-screen-sharing-demo';

connection.session = {
    audio: 'two-way', // merely audio will be two-way, rest of the streams will be oneway
    screen: true,
    oneway: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

connection.videosContainer = document.getElementById('videos-container');
connection.audiosContainer = document.getElementById('audios-container');

connection.onstream = function(event) {
    if(event.type === 'remote' && !connection.session.video) {
        document.getElementById('btn-add-video').disabled = false;
    }

    var width = event.mediaElement.clientWidth || connection.videosContainer.clientWidth;
    var mediaElement = getMediaElement(event.mediaElement, {
        title: event.userid,
        buttons: ['full-screen'],
        width: width,
        showOnMouseEnter: false
    });

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
    var mediaElement = document.getElementById(event.streamid);
    if(mediaElement) {
        mediaElement.parentNode.removeChild(mediaElement);
    }
};

document.getElementById('btn-add-video').onclick = function() {
    this.disabled = true;
    connection.session.video = true;
    connection.addStream({
        video: true,
        oneway: true
    });
};

// Using getScreenId.js to capture screen from any domain
// You do NOT need to deploy Chrome Extension YOUR-Self!!
connection.getScreenConstraints = function(callback) {
    getScreenConstraints(function(error, screen_constraints) {
        if (!error) {
            screen_constraints = connection.modifyScreenConstraints(screen_constraints);
            callback(error, screen_constraints);
            return;
        }
        throw error;
    });
};