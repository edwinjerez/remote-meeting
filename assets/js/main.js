var project_table;
var selected_project_id = null;
var playing = false;

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
$(document).ready( function() {

    // document.getElementById("frame-content").src = "http://www.decans.cn/stl-operation/";
    // $("#frame-content").src = "http://www.decans.cn/stl-operation/";
    $height = window.innerHeight - 56;
    $(".nice-nav").css('height', $height + 'px');
    $(".body-part").css('height', ($height - 3) + 'px');
    $(".body-back").css('height', $height + 'px');

    $('svg').click(function() {
        playing = !playing;
        var animation = playing ? 'stop' : 'play';
        $('#animate_to_' + animation).get(0).beginElement();
        $('#animate1_to_' + animation).get(0).beginElement();
    });

    $(".sexytabs").tabs({ 
        show: { effect: "slide", direction: "left", duration: 200, easing: "easeOutBack" } ,
        hide: { effect: "slide", direction: "right", duration: 200, easing: "easeInQuad" } 
    });
    
    $(".dcm-btn").click(function() {
        toggleLeft('display-panel');
        $(".body-back").css('display', 'none');
        document.getElementById("frame-content").src = "http://www.decans.cn/stl-operation/";
    });

    $(".stl-btn").click( function() {
        toggleLeft('display-panel');
        $(".body-back").css('display', 'none');
        document.getElementById("frame-content").src = "http://www.decans.cn:3000/2c04ea71666ff20027dd9845baa0e0d5";
    })
    $(".display-btn").click( function() {
        toggleLeft('display-panel');
    });

    $(".control-btn").click( function() {
        toggleLeft('control-panel');
    });

    $(".record-btn").click( function() {
        toggleLeft('record-panel');
    });

    $("a.toggle-nav").click( function() {
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


    $("#modal_projects").css("display",'block');

    $(".cancel-project-btn").click( function() {
        location.href = 'https://www.decans.cn';
    })
    window.onclick = function(event) {
        if (event.target == document.getElementById("frame-content") || event.target == document.getElementsByClassName("body-back")[0] ) {
            $(".darkpage").css('left', '-255px');
        }
    };
})