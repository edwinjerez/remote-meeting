var project_table;
var selected_project_id = null;

function closeDialog() {
    project_table.page( 'first' ).draw('page');
    $("#project-table tr").removeClass("selected");
    selected_project_id = null;
    $("#modal_projects").css("display",'none');
}

$(document).ready( function() {

    $height = window.innerHeight - 56;
    $(".nice-nav").css('height', $height + 'px');
    $(".body-part").css('height', ($height - 3) + 'px');
    $(".body-back").css('height', $height + 'px');

    $(".sexytabs").tabs({ 
        show: { effect: "slide", direction: "left", duration: 200, easing: "easeOutBack" } ,
        hide: { effect: "slide", direction: "right", duration: 200, easing: "easeInQuad" } 
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


    // $("#modal_projects").css("display",'block');

    $(".cancel-project-btn").click( function() {
        location.href = 'https://www.decans.cn';
    })
    // window.onclick = function(event) {
    //     if (event.target == document.getElementById("modal_implant") || event.target == document.getElementById("modal_projects")) {
    //       $("#modal_projects").css("display",'none');
    //     }
    // };
})