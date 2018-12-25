var project_table;
var selected_project_id = null;

function closeDialog() {
    project_table.page( 'first' ).draw('page');
    $("#project-table tr").removeClass("selected");
    selected_project_id = null;
    $("#modal_projects").css("display",'none');
}

$(document).ready( function() {


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
    window.onclick = function(event) {
        if (event.target == document.getElementById("modal_implant") || event.target == document.getElementById("modal_projects")) {
          $("#modal_projects").css("display",'none');
        }
    };
})