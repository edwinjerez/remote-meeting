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

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css">
    <script src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.min.css"/>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.1/dist/sweetalert2.min.js"></script>
    <script type="text/javascript" src="./assets/js/main.js"></script>
</head>
<body>
<div class="header">
  <div class="left-head">
 <div class="logo">
      <img src="http://cdns2.freepik.com/media/img/logo.png">
    </div>
    <a href="#" class="toggle-nav"><i class="fas fa-bars"></i></a>
  </div>
  <div class="right-head">
   
  </div>
</div>
<div class="nice-nav">
  <div class="user-info clear">
    <h2>Skyortho</h2>
  </div>
  <div class="clear"></div>
  <ul>
    <li class="child-menu">
      <a href="#"><span class='lbl-r'><i class="fas fa-eye"></i>Display</span><span class="arr-right"><i class="fas fa-chevron-right"></i></span></a>
    </li>
    <li class="child-menu">
      <a href="#"><span class='lbl-r'><i class="fas fa-microphone-alt"></i>Control</span><span class="arr-right"><i class="fas fa-chevron-right"></i></span></a>
    </li>
    <li class="child-menu">
      <a href="#"><span class='lbl-r'><i class="fas fa-video"></i>Record</span><span class="arr-right"><i class="fas fa-chevron-right"></i></span></a>
    </li>
  </ul>
</div>
<div class="darkpage" style="display:none">
	<div class="sexytabs dark">
		<ul>
			<li><a href="#tab_dicom">
			<span>Dicom</span></a></li>
			<li><a href="#tab_stl">
			<span>STL</span></a></li>
			<li><a href="#tab_share">
			<span>Share</span></a></li>
		</ul>
		<div class="contents">
			<div id="tab_dicom">
				dicom
			</div>
			<div id="tab_stl">
				stl
			</div>
			<div id="tab_share">
				share
			</div>
		</div>
	</div>
</div>
<div class="body-part">
	<div class="body-back">
	</div>
	<iframe></iframe>
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
						<th>Name</th>
					</tr>
					</thead>
					<tbody>
						<tr>
							<td>1</td>
							<td>Admin</td>
							<td>Right side_femoral fracture_45Y_F</td>
						</tr>
						<tr>
							<td>2</td>
							<td>Admin</td>
							<td>Artificial kneearthroplasty</td>
						</tr>
					</tbody>
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
</body>
</html>