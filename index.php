<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Remote Meeting</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="./assets/css/main.css">
    <link rel="stylesheet" href="./assets/css/left-side-bar.css">
	<link rel="stylesheet" href="./assets/css/dark.css">
    <link rel="stylesheet" href="./assets/css/ui-modal.css">

	<script src="./assets/js/webrtc/RTCMultiConnection.min.js"> </script>
	<script src="./assets/js/webrtc/adapter.js"> </script>
	<script src="./assets/js/webrtc/socket.io.js"> </script>
	<script src="./assets/js/webrtc/getScreenId.js"> </script>
	<!-- custom layout for HTML5 audio/video elements -->
	<script src="./assets/js/webrtc/getMediaElement.js"></script>
	<link rel="stylesheet" href="https://cdn.WebRTC-Experiment.com/getMediaElement.css">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript" src="./assets/js/cdn/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="./assets/js/cdn/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="./assets/css/cdn/jquery.dataTables.min.css">
    <script src="./assets/js/cdn/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
    <link rel="stylesheet" href="./assets/css/cdn/sweetalert2.min.css"/>
    <script src="./assets/js/cdn/sweetalert2.min.js"></script>
	<script type="text/javascript" src="./assets/js/global.js"></script>
	<script type="text/javascript" src="./assets/js/main.js"></script>
	<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ajhifddimkapgcifgcodmmfdlknahffk">
	<script src="https://www.WebRTC-Experiment.com/RecordRTC.js"></script>
	<!-- scripts used for screen-sharing -->
	<link rel="author" type="text/html" href="https://plus.google.com/+MuazKhan">
	<script>
		window.useThisGithubPath = 'muaz-khan/RTCMultiConnection';
	</script>
	<!-- <script src="https://cdn.webrtc-experiment.com/commits.js"></script> -->

</head>
<body>
<!-- <button id="btn-record-start1">Start</button>
	<button id="btn-record-stop1">Stop</button> -->
<div class="client-content">
	<div class="embed-back media-content" id="videos-container"></div>
	<div class="embed-back media-content" id="audios-container"></div>
</div>
<div class="owner-content" style="display:none;">
	<div class="header">
	<div class="left-head">
		<div class="logo">
			<h2>Skyortho</h2>
		</div>
		<a href="#" class="toggle-nav"><i class="fas fa-bars"></i></a>
		</div>
		<div class="share-screen">
			<h2>Share Screen</h2>
			<svg viewbox="0 0 140 140">
				<circle cx="70" cy="70" r="65" style="fill:#fff;stroke:#ddd"/>
				<polygon id="shape" points="50,40 100,70 100,70 50,100, 50,40" style="fill:#aaa;">
					<animate 
					id="animate_to_stop" 
					begin="indefinite" 
					fill="freeze" 
					attributeName="points" 
					dur="500ms" 
					to="45,45 95,45 95,95, 45,95 45,45"
					keySplines="
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1"
					keyTimes="0;0.22;0.33;0.55;0.66;0.88;1" 
					calcMode="spline"
					/>
					
					<animate 
					id="animate_to_play" 
					begin="indefinite" 
					fill="freeze" 
					attributeName="points" 
					dur="500ms" 
					to="50,40 100,70 100,70 50,100, 50,40" 
					keySplines="
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1; 
						0.1 0.8 0.2 1"
					keyTimes="0;0.22;0.33;0.55;0.66;0.88;1" 
					calcMode="spline"
					/>
				</polygon>
			</svg>
		</div>
	<div class="right-head">
	
	</div>
	</div>
	<div class="nice-nav">
	<div class="user-info clear">
		
	</div>
	<div class="clear"></div>
	<ul>
		<li class="child-menu">
		<a href="#" class='display-btn'><span class='lbl-r'><i class="fas fa-eye"></i>Display</span><span class="arr-right"><i class="fas fa-chevron-right"></i></span></a>
		</li>
		<li class="child-menu">
		<a href="#" class='control-btn'><span class='lbl-r'><i class="fas fa-microphone-alt"></i>Control</span><span class="arr-right"><i class="fas fa-chevron-right"></i></span></a>
		</li>
		<li class="child-menu">
		<a href="#" class='record-btn'><span class='lbl-r'><i class="fas fa-video"></i>Record</span><span class="arr-right"><i class="fas fa-chevron-right"></i></span></a>
		</li>
	</ul>
	</div>
	<div class="darkpage display-panel">
		<div class="sexytabs dark">
			<ul>
				<li><a href="#tab_project">
				<span>Dicom</span></a></li>
				<li><a href="#tab_share">
				<span>Share</span></a></li>
			</ul>
			<div class="contents">
				<div id="tab_project">
					<button class='selected button'>Refresh</button>
					<ul class='dcm-list'>
						<li><div class="media-body"><span>Test_02_股骨_近端骨折</span></div><div class="media-right"><button class='button dcm-btn'>Dcm Viewer</button></div>
						<li><div class="media-body"><span>Left.stl</span></div><div class="media-right"><button class='button stl-btn'>Stl Viewer</button></div>
					</ul>
				</div>
				<div id="tab_share">
					<h2>Start Share Screen</h2>
					<svg viewbox="0 0 140 140">
						<circle cx="70" cy="70" r="65" style="fill:#fff;stroke:#ddd"/>
						<polygon id="shape" points="50,40 100,70 100,70 50,100, 50,40" style="fill:#aaa;">
							<animate 
							id="animate1_to_stop" 
							begin="indefinite" 
							fill="freeze" 
							attributeName="points" 
							dur="500ms" 
							to="45,45 95,45 95,95, 45,95 45,45"
							keySplines="
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1"
							keyTimes="0;0.22;0.33;0.55;0.66;0.88;1" 
							calcMode="spline"
							/>
							
							<animate
							id="animate1_to_play"
							begin="indefinite"
							fill="freeze"
							attributeName="points"
							dur="500ms"
							to="50,40 100,70 100,70 50,100, 50,40" 
							keySplines="
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1; 
								0.1 0.8 0.2 1"
							keyTimes="0;0.22;0.33;0.55;0.66;0.88;1" 
							calcMode="spline"
							/>
						</polygon>
					</svg>
				</div>
			</div>
		</div>
	</div>
	<div class="darkpage control-panel">
		<div class="contents">
			<div class="icon-panel">
				<i class="fas fa-microphone-slash"></i>
				<i class="fas fa-volume-mute"></i>
				<i class="fas fa-user"></i>
			</div>
			<div id="parti-list">
				<ul class='p-list'>
					
				</ul>
			</div>
		</div>
	</div>
	<div class="darkpage record-panel">
		<div class="contents">
			<div class="icon-panel">
				<i class="fas fa-play btn-record-start"></i>
				<i class="fas fa-stop"></i>
			</div>
			<div id="parti-list">
				<ul class='record-list'>
					<li><input type="text" value="project_18382834.mp4"><button class='button'>Save</button></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="body-part">
		<div class="body-back">
		</div>
		<iframe id="frame-content" src=""></iframe>
	</div>

	<div id="modal_projects" class="modal">
		<div class="modal-projects">
			<div class="modal-title">
				<br/>
				Choose a Project to start
			</div>
			<br/>
			<hr class="modal-splitter" />
			<br/>
			<div class="projects-body">

				<div id="projects-container">
					<!-- <a href="#" class="close-classic" onclick="closeDialog()"></a> -->
					
					<div style="padding-top: 10px; ">
					<table id="project-table" class="display" style="width: 100%">
						<thead>
						<tr>
							<th>No</th>
							<th>Owner</th>
							<th>Meeting Id</th>
							<th>Name</th>
						</tr>
						</thead>
					</table>
					</div>
					<div style="padding-top:10px; display: inline-flex;">        
					<button class="cancel-project-btn">Cancel</button>
					<button class="load-project-btn">Start</button>
					</div>
				</div>

			</div>
		</div>
	</div>
</div>
</body>
</html>