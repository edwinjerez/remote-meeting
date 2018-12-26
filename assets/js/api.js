(function(window, undefined) {
    var api = {};

    function successHandler(responseString, callback) {
        var result = $.parseJSON(responseString);
        if(result.result_code != "0000") {
            Helper.handlerError(result);
            return;
        }
        if(typeof callback == "function") {
            callback(result.data);
        }
    }

    //列表导出
    api.exportList = function (params,url,callback) {
        var urlString = url;
        var paramsString = JSON.stringify(params);
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"post", data:paramsString,headers:headerObj,success:function(responseString) {
        successHandler(responseString, callback);
        }});
    };
    //用户注册
    api.regUser = function (params, callback) {
        var urlString = Config.domain + "register";
        var headerObj = {"Content-Type":"application/json;charset=UTF-8"};
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //判断用户账号是否存在
    api.checkAccount = function (params,callback) {
        var urlString = Config.domain + "check_account";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //用户找回密码操作，新设密码接口
    api.resetForgetPassword = function (params,callback) {
        var urlString = Config.domain + "update_password";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //找回密码时验证验证码是否正确
    api.checkCode = function (params,callback) {
        var urlString = Config.domain + "check_code";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //发送手机验证码
    api.postMobileMsg = function (params,callback) {
        var urlString = Config.domain + "send_msg";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };
    //发送邮箱验证码
    api.postEmailMsg = function (params,callback) {
        var urlString = Config.domain + "send_email";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post",data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //重新向用户发送激活邮件
    api.reSendCheckEmail = function (params,callback) {
        var urlString = Config.domain + "re_send_check_email";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post",data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //用户手机号认证
    api.checkUserMobile = function (params,callback) {

        var urlString = Config.domain + "users/check_user_mobile";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url: urlString, type: "post", data: paramsString, headers: headerObj, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //用户邮箱认证
    api.checkUserEmail = function (params,callback) {

        var urlString = Config.domain + "users/post_check_user_email";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url: urlString, type: "post", data: paramsString, headers: headerObj, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //上传文件
    api.uploadFile = function(file, callback) {
        if(file == undefined){
            return;
        }

        var urlString = Config.domain + "files";
        var headerObj = Helper.getHeaders();
        var headers = {"Access-Token": headerObj['Access-Token']};
        var formData = new FormData();
        formData.append("file",file);
        $.ajax({url: urlString, type: "post", data: formData, headers: headers, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //用户登陆
    api.login = function (params,callback) {
        var urlString = Config.domain + "login";
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //用户登陆后获取自己的信息
    api.loadMyInfo = function (callback) {
        var urlString = Config.domain + "users/my";
        var tokenInfoString = getCookie(Config.key.k_token);
        if(!tokenInfoString || tokenInfoString == 'null'){
            return;
        }
        var tokenInfo = JSON.parse(tokenInfoString);
        var headerObj = {"Access-Token": tokenInfo.token,"Content-Type":"application/json;charset=UTF-8"};//请求头
        $.ajax({url:urlString, type:"get", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //用户修改自己的头像
    api.postMyLogo = function (file,callback) {
        if(file == undefined){
            return;
        }

        var urlString = Config.domain + "users/myLogo";
        var headerObj = Helper.getHeaders();
        var headers = {"Access-Token": headerObj['Access-Token']};
        var formData = new FormData();
        formData.append("file",file);
        $.ajax({url: urlString, type: "post", data: formData, headers: headers, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //用户修改自己的信息
    api.putMyInfo = function (params,callback) {

        var urlString = Config.domain + "users/my";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url: urlString, type: "put", data: paramsString, headers: headerObj, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //获得附件列表
    api.loadFiles = function(params, callback) {
        var urlString = Config.domain + "files/condition";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //项目选择添加附件
    api.postProjectFiles = function(params, callback) {
        var urlString = Config.domain + "projects/" + + params.projectId + "/files/add_more";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获得用户列表
    api.loadUsers = function(params, callback) {
        var urlString = Config.domain + "users/condition";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //项目获得可选负责人列表
    api.loadLeaderUsers = function(params, callback) {
        var urlString = Config.domain + "users/select_leader_users";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //项目获得可选项目助手列表
    api.loadHelperUsers = function(params, callback) {
        var urlString = Config.domain + "users/select_helper_users";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };


    //项目获得可选成员列表
    api.loadNormalUsers = function(params, callback) {
        var urlString = Config.domain + "users/select_users";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //用户权限页获得用户列表
    api.loadUsers2 = function(params, callback) {
        var urlString = Config.domain + "users/condition2";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };
    //管理员创建用户
    api.postUser = function(params, callback) {
        var urlString = Config.domain + "users";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post",headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //管理员获取指定用户信息
    api.loadUser = function(params,callback){
        var urlString = Config.domain + "users/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"get", headers:headerObj,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //管理员修改用户
    api.putUser = function(params, callback) {
        var urlString = Config.domain + 'users/' + params.id;

        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //管理员修改用户头像
    api.postUserLogo = function(file,params, callback) {
        if(file == undefined){
            return;
        }

        var urlString = Config.domain + "users/" + params.id + "/logo";
        var headerObj = Helper.getHeaders();
        var headers = {"Access-Token": headerObj['Access-Token']};
        var formData = new FormData();
        formData.append("file",file);
        $.ajax({url: urlString, type: "post", data: formData, headers: headers, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //删除一个用户
    api.deleteOneUser = function (params,callback) {
        var userId = params.userId;
        var urlString = Config.domain + "users/" + userId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除多个用户
    api.deleteMoreUser = function (params,callback) {
        var urlString = Config.domain + "users";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //解绑一个用户的微信
    api.unblindWx = function (params,callback) {
        var userId = params.userId;
        var urlString = Config.domain + "users/" + userId + "/unblindWx";
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"post", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //设置一个用户通过审核
    api.passOneUserCheck = function (params,callback) {
        var userId = params.userId;
        var urlString = Config.domain + "users/" + userId + "/pass_user_check";
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"put", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //设置多个用户通过审核
    api.passMoreUserCheck = function (params,callback) {
        var urlString = Config.domain + "users/pass_more_user_check";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //上传dicom压缩包文件
    api.uploadDicomZip = function(file, callback) {
        if(file == undefined){
            return;
        }

        var urlString = Config.domain + "dicom/upload/file";
        var headerObj = Helper.getHeaders();
        var headers = {"Access-Token": headerObj['Access-Token']};
        var formData = new FormData();
        formData.append("file",file);
        $.ajax({url: urlString, type: "post", data: formData, headers: headers, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //创建dicom
    api.postDicom = function(params, callback) {
        var urlString = Config.domain + "dicoms";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post",headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //查看指定dicom
    api.loadDicom = function (params,callback) {
        var urlString = Config.domain + "dicoms/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"get",headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //修改dicom
    api.putDicom = function(params, callback) {
        var urlString = Config.domain + 'dicoms/' + params.id;

        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除一个dicom
    api.deleteOneDicom = function (params,callback) {
        var dicomId = params.dicomId;
        var urlString = Config.domain + "dicoms/"+dicomId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除多个dicom
    api.deleteMoreDicom = function (params,callback) {
        var urlString = Config.domain + "dicoms";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获得dicom列表
    api.loadDicoms = function(params, callback) {
        var urlString = Config.domain + "dicoms/condition";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //创建项目时获得可选dicom列表
    api.loadSelectDicoms = function(params, callback) {
        var urlString = Config.domain + "dicoms/select";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //下载一个dicom文件
    api.downloadOneDicom = function(params, callback) {
        var urlString = Config.domain + "dicom/download/file";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };
    //批量下载dicom文件
    api.downloadMoreDicom = function(params, callback) {
        var urlString = Config.domain + "dicom/download_more/file";
        var headerObj = Helper.getHeaders();
        var paramsString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //创建项目
    api.postProject = function(params, callback) {
        var urlString = Config.domain + 'projects';
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };
    //修改项目
    api.patchProject = function(params, callback) {
        var urlString = Config.domain + 'projects/' + params.id;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"patch", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除单个项目
    api.deleteOneProject = function (params,callback) {
        var projectId = params.projectId;
        var urlString = Config.domain + "projects/"+projectId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除多个项目
    api.deleteMoreProject = function (params,callback) {
        var urlString = Config.domain + "projects";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获取项目的列表
    api.loadProjects = function (params,callback) {
        var urlString = Config.domain + "projects/condition";
        var headerObj = Helper.getHeaders();

        var paramsString = JSON.stringify(params);
        //alert(paramsString);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:paramsString,success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //项目基本信息
    api.loadProject = function(projectId, callback) {
        var urlString = Config.domain + "projects/" + projectId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"get", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获取项目参数列表
    api.loadProjectParams = function(params, callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/params/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获取项目dicom列表
    api.loadProjectDicoms = function(params, callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获取项目人员列表
    api.loadProjectUsers = function(params, callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/users/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //添加项目的成员
    api.postProjectUsers = function(params, callback){
        var urlString = Config.domain + "projects/" + params.projectId + "/users";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获取项目的附件列表
    api.loadProjectFiles = function(params, callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/files/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //添加项目的参数
    api.addProjectParam = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/params";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除项目的参数
    api.delProjectParam = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/params/" + params.paramsId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //修改项目信息
    api.putProject = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId ;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获得指定的项目的一个dicom信息
    api.postProjectDicom = function(params, callback) {
        var urlString = Config.domain + 'projects/' + params.projectId + "/dicoms";

        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //设置项目dicom参数
    api.submitProjectDicomParam = function(params, callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms/" + params.dicomId + "/params";

        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除项目的一个dicom
    api.deleteOneProjectDicom = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms/" + params.dicomId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除项目多个dicom
    api.deleteMoreProjectDicom = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除项目的一个成员
    api.deleteOneProjectUser = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/users/" + params.userId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除项目多个成员
    api.deleteMoreProjectUser = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/users";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //指定项目建模人
    api.postProjectModeler = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms/" + params.dicomId + "/assign";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //指定项目观测人
    api.postProjectObserver = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms/" + params.dicomId + "/assign_observer";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //设置建模完成或观测完成
    api.postProjectDicomDone = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms/" + params.dicomId + "/status";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };


    //项目指定dicom详情
    api.loadProjectDicom = function(params, callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/dicoms/" + params.dicomId;
        var headerObj = Helper.getHeaders();
        //var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"get", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //获得创建项目时可以被选择的附件
    api.loadFilesForProjectSelect = function (params ,callback) {
        var urlString = Config.domain + "projects/files/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //上传添加一个项目的附件
    api.postProjectFile = function (params ,callback) {
        var projectId = params.projectId;
        var urlString = Config.domain + "projects/" + projectId + "/files";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //修改项目的一个附件
    api.putProjectFile = function (params ,callback) {
        var projectId = params.projectId;
        var urlString = Config.domain + "projects/" + projectId + "/files/" + params.fileId;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除项目的一个附件
    api.deleteOneProjectFile = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/files/" + params.id;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //删除项目多个附件
    api.deleteMoreProjectFile = function (params,callback) {
        var urlString = Config.domain + "projects/" + params.projectId + "/files";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //批量下载项目附件
    api.downloadProjectFiles = function (params,callback) {
        var urlString = Config.domain + "dicom/down_load_files/file";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //我建模或观测的项目
    api.loadMywork = function (params ,callback) {
        var urlString = Config.domain + "projects/my_work";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };

    //显示查询历史列表
    api.loadConditions = function (params,callback) {
        var urlString = Config.domain + "conditions/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //保存查询历史
    api.postConditions = function (params,callback) {
        var urlString = Config.domain + "conditions";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //修改查询历史
    api.patchConditions = function (params,callback) {
        var urlString = Config.domain + "conditions/" + params.conditionId;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"patch", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //删除查询历史
    api.deleteOneCondition = function (params,callback) {
        var urlString = Config.domain + "conditions/" + params.conditionId;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //查看用户行为
    api.loadActions = function(params,callback){
        var urlString = Config.domain + "actions/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //附件管理修改一个附件
    api.putFile = function (params ,callback) {
        var urlString = Config.domain + "files/" + params.fileId;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj,data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        } });
    };
    //附件管理删除一个附件
    api.deleteOneFile = function (params,callback) {
        var urlString = Config.domain + "files/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //附件管理删除多个附件
    api.deleteMoreFile = function (params,callback) {
        var urlString = Config.domain + "files";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"delete", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //创建帮助文档
    api.postHelpDoc = function (params,callback) {
        var urlString = Config.domain + "helpdocs";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //帮助文档列表
    api.loadHelpDocs = function (params,callback) {
        var urlString = Config.domain + "helpdocs/condition";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //后台查看一个帮助文档
    api.getDoc = function (params,callback) {
        var urlString = Config.domain + "helpdocs/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"get", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };
    //后台修改一个帮助文档
    api.updateDoc = function (params,callback) {
        var urlString = Config.domain + "helpdocs/" + params.id;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };
    //删除一个帮助文档
    api.deleteOneHelpDoc = function (params,callback) {
        var urlString = Config.domain + "helpdocs/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };


    //前端查看一个帮助文档（附带上一篇和下一篇）
    api.getHelpDoc = function (params,callback) {
        var id = params.id;
        var urlString = Config.domain + "helpdocs/" + id + "/condition";
        $.ajax({url:urlString, type:"get", success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //提交问题反馈
    api.postFeedback = function (params,callback) {
        var urlString = Config.domain + "feedbacks";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //查看一个反馈的详情
    api.loadFeedback = function(params,callback){
        var urlString = Config.domain + "feedbacks/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"get", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //删除一个反馈
    api.deleteOneFeedback = function(params,callback){
        var urlString = Config.domain + "feedbacks/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //处理一个反馈，将反馈状态和处理说明修改
    api.putFeedback = function(params,callback){
        var urlString = Config.domain + "feedbacks/" + params.id;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //查看反馈列表
    api.loadFeedbacks = function (params,callback) {
        var urlString = Config.domain + "feedbacks/condition";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获取首页设置
    api.loadIndexSetting = function(callback){
        var urlString = Config.domain + "index_setting";
        $.ajax({url:urlString, type:"get", success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //更改首页设置
    api.putIndexSetting = function(params,callback){
        var urlString = Config.domain + "index_setting";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //添加首页dicom实例
    api.postIndexDicom = function(params,callback){
        var urlString = Config.domain + "index_dicoms";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获得首页dicom实例列表
    api.loadIndexDicoms = function (callback) {
        var urlString = Config.domain + "index_dicoms/condition";
        $.ajax({url:urlString, type:"post", success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获得首页一个dicom实例
    api.loadIndexDicom = function (params,callback) {
        var urlString = Config.domain + "index_dicoms/" + params.id;

        $.ajax({url:urlString, type:"get", success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //修改首页一个dicom实例
    api.updateIndexDicom = function (params,callback) {
        var urlString = Config.domain + "index_dicoms/" + params.id;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //删除首页一个dicom实例
    api.deleteOneIndexDicom = function (params,callback) {
        var urlString = Config.domain + "index_dicoms/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //添加首页项目实例
    api.postIndexProject = function(params,callback){
        var urlString = Config.domain + "index_projects";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获得首页项目实例列表
    api.loadIndexProjects = function (callback) {
        var urlString = Config.domain + "index_projects/condition";

        $.ajax({url:urlString, type:"post", success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获得首页一个项目实例
    api.loadIndexProject = function (params,callback) {
        var urlString = Config.domain + "index_projects/" + params.id;
        $.ajax({url:urlString, type:"get", success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //修改首页一个项目实例
    api.updateIndexProject = function (params,callback) {
        var urlString = Config.domain + "index_projects/" + params.id;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //删除首页一个项目实例
    api.deleteOneIndexProject = function (params,callback) {
        var urlString = Config.domain + "index_projects/" + params.id;
        var headerObj = Helper.getHeaders();

        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获取协议设置
    api.loadAgreementSetting = function(callback){
        var urlString = Config.domain + "agreement_setting";
        $.ajax({url:urlString, type:"get", success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //更改协议设置
    api.putAgreementSetting = function(params,callback){
        var urlString = Config.domain + "agreement_setting";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };


    /**
     * 加载角色的权限
     *
     * @param params
     * @param callback
     */
    api.loadPowers = function(params, callback) {
        var urlString = Config.domain + "roles/" + params.id + "/powers";
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"get", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    /**
     * 设置角色的权限
     *
     * @param params
     * @param callback
     */
    api.putPowers = function(params, callback) {
        var urlString = Config.domain + "roles/" + params.id + "/powers";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString,success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获得医院列表(后台)
    api.loadHospitals = function (params,callback) {
        var urlString = Config.domain + "hospitals/condition";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获得医院列表(前台选择医院弹窗)
    api.loadSelectHospitals = function (params,callback) {
        var urlString = Config.domain + "hospitals/select";
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获得一个医院的信息
    api.loadHospital = function (params,callback) {
        var urlString = Config.domain + "hospitals/" + params.id;
        var headerObj = Helper.getHeaders();
        $.ajax({url:urlString, type:"get", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //添加一个医院
    api.postHospital = function (params,callback) {
        var urlString = Config.domain + "hospitals";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //修改一个医院的信息
    api.putHospital = function(params,callback){
        var urlString = Config.domain + "hospitals/" + params.id;
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"put", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //删除一个医院
    api.deleteOneHospital = function (params,callback) {
        var urlString = Config.domain + "hospitals/" + params.id;
        var headerObj = Helper.getHeaders();

        $.ajax({url:urlString, type:"delete", headers:headerObj, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };
    //导入医院
    api.importHospital = function(file, callback) {
        if(file == undefined){
            return;
        }

        var urlString = Config.domain + "hospitals/import_hospital";
        var headerObj = Helper.getHeaders();
        var headers = {"Access-Token": headerObj['Access-Token']};
        var formData = new FormData();
        formData.append("file",file);
        $.ajax({url: urlString, type: "post", data: formData, headers: headers, contentType: false, processData: false,
            success: function (responseString) {
                successHandler(responseString, callback);
            }
        });
    };

    //保存用户的指定页面设置
    api.postPageSetting = function (params,callback) {
        var urlString = Config.domain + "page_setting/add";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //获取用户的指定页面设置
    api.loadPageSetting = function (params,callback) {
        var urlString = Config.domain + "page_setting/get";
        var headerObj = Helper.getHeaders();
        var dataString = JSON.stringify(params);
        $.ajax({url:urlString, type:"post", headers:headerObj, data:dataString, success:function(responseString) {
            successHandler(responseString, callback);
        }});
    };

    //export window
    window.Api = api;
})(window);