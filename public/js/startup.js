$(document).ready(function () {
    $(document).on("click", "#active", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#requestProject").hide();
        $("#findList").hide();
        $("#completeList").hide();
        $("#activeList").show();
    })
    $(document).on("click", "#find", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#requestProject").show();
        $("#findList").show();
        $("#completeList").hide();
        $("#activeList").hide();
    })
    $(document).on("click", "#complete", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#requestProject").hide();
        $("#findList").hide();
        $("#completeList").show();
        $("#activeList").hide();
    })

    // $(document).on("click", "#requestProject", function (event) {
    //     event.preventDefault();
    //     var projView = $("#project-display-section");
    //     projView.empty();
    //     var source = `<div class="container-fluid">
    //                     <div class="form-group row">
    //                         <label for="staticEmail" class="col-sm-4 col-form-label"><h5>Project Request Form</h5></label>
    //                     </div>
    //                     <div class="form-group input-icons">
    //                     <i class="fas fa-user icon"></i>
    //                         <input type="name" class="form-control input-field" id="title-input" placeholder="Title">
    //                     </div>
    //                     <div class="form-group input-icons">
    //                     <i class="fas fa-dollar-sign icon"></i>
    //                         <input type="price" class="form-control input-field" id="price-input"
    //                             placeholder="What is your budget?">
    //                     </div>
    //                     <div class="form-group">
    //                         <textarea type="email" class="form-control" id="description-input"
    //                             placeholder="Please describe your project..."></textarea>
    //                     </div>
    //                     <div class="form-group justify-content-center">
    //                         <button type="button" class="btn-grad" id="submitProject">Submit</button>
    //                     </div>
    //                 </div>`;
    //     var template = Handlebars.compile(source);
    //     projView.html(template({}));
    // });

    $(document).on("click", "#submitProject", function (event) {
        event.preventDefault();
        var title = $("#title-input").val().trim();
        var description = $("#description-input").val().trim();
        var price = $("#price-input").val().trim();
        var OrgId = start_up_id;
        var newProject = {
            title: title,
            description: description,
            price: price,
            OrgId: OrgId
        };
        $("#title-input").val("");
        $("#description-input").val("");
        $("#price-input").val("");
        $.post("/api/project", newProject)
            .then(function (data) {
                location.reload();
            });
    });

    $(document).on("click", ".project", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            console.log(project);
            var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                            <h3 class='info mb-3'>Project Information</h3>
                                <p class='bold'>TITLE</p>
                                <p>{{title}}</p>
                            </div>
                            <div class='project-description'>
                                <p class='bold'>DESCRIPTION</p>
                                <p>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <p class='bold'>BUDGET</p>
                                <p>$ {{price}}</p>
                            </div>
                            <div class='d-flex justify-content-center'>
                                <button data-id='{{id}}' class="btn-grad m-1 justify-content-center pickCandidate">Load Candidates</button>
                            </div>
                            <div>
                            <ul class="list-group pl-3" id="candidateList">
                                </ul>
                                </div>
                            <!--Modal-->
                            <div class="modal fade" id="appliedDevModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title bold" id="modal_developer_name"></h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <h3 class="bold">Developer's Qualifications</h3>
                                    <p id="modal_bid_content"></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn-grad" data-dismiss="modal">Close</button>
                                    <button href="#" type="button" class="btn-grad modalProfileBtn">Profile Page</button>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    $(document).on("click", ".pickCandidate", function (event) {
        event.preventDefault();
        $("#candidateList").text("");
        var projectId = $(this).data("id");
        $.get(`/pick/${projectId}`, function (project) {
            var devList = project.developers_list;
            $.get("/api/users").then(function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (devList.includes(data[i].id.toString()) && !data[i].status) {
                            var obj = data[i];
                            obj.projId = projectId;
                            var currList = `<li class="applieddeveloper list-group-item d-flex justify-content-between align-items-center" data-id="${obj.id}" data-proj="${obj.projId}" data-name="${obj.first_name}"> ${obj.first_name} 
                <button class="pickFinalUser btn-grad" data-id="${obj.id}" data-proj="${obj.projId}">Choose Candidate</button>
                </li>`;
                            $("#candidateList").append(currList);
                        }
                    }
                }
            });
        });
    });

    $(document).on("click", ".applieddeveloper", function (event) {
        event.preventDefault();
        var developer_name = $(this).data("name");
        var userId = $(this).data("id");
        var projId = $(this).data("proj");
        $("#modal_developer_name").html(developer_name);
        $.get(`/api/userbid/${userId}/${projId}`, function (data) {
            $("#modal_bid_content").html(data.bid_content);
            $(".modalProfileBtn").attr("data-id", userId);
            $("#appliedDevModal").modal();
        });
        $(document).on("click", ".modalProfileBtn", function (event) {
            event.preventDefault();
            // var userId = $(this).data("id");
            console.log(userId);
            // console.log($(this).data("id"));
            loadDevProfile(userId);
        });
    });

    // $(document).on("click", ".modalProfileBtn", function (event) {
    //     event.preventDefault();
    //     var userId = $(this).data("id");
    //     console.log(userId);
    //     console.log($(this).data("id"));
    //     loadDevProfile(userId);
    // });

    $(document).on("click", ".pickFinalUser", function (event) {
        event.stopPropagation();
        event.preventDefault();
        var userId = $(this).data("id");
        var projId = $(this).data("proj");
        $.ajax({
            url: `/proccess/${projId}/${userId}`,
            method: "PUT",
        }).then(function () {
            $.ajax({
                method: "PUT",
                url: `/update/user/${userId}/0`,
            }).then(function () {
                location.reload();
                // $.ajax({
                //     method: "PUT",
                //     url: `/recovers/${projId}/${userId}`
                // }).then(function () {

                // })
            })
        })
    });

    $(document).on("click", ".activeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            var source = `
                        <div class='project-content mt-3'>
                        <div class='project-title'>
                        <h3 class='info mb-3'>Project Information</h3>
                            <p class='bold'>TITLE</p>
                            <p>{{title}}</p>
                        </div>
                        <div class='project-description'>
                            <p class='bold'>DESCRIPTION</p>
                            <p>{{description}}</p>
                        </div>
                        <div class='project-price'>
                            <p class='bold'>BUDGET</p>
                            <p>$ {{price}}</p>
                        </div>
                            </div>
                            <div>
                            <button data-id='{{id}}' data-uid="{{final_developer}}" class="btn-grad viewFinalCandidate mb-3"> View Final Candidate</button>
                            <ul class="list-group finalCandidateList">

                            </ul>
                            </div>
                            <h3 class="bold">CHAT NOW</h3>
                <div class="container-fluid justify-content-center">
                                <div class ="chatBox col" id="msglog">
                                </div>
                                <textarea name="message" class="col p-1" id="messageInput" placeholder="Enter chat content here"></textarea>
                            <div>
                                Press Enter to Send!
                            </div>
                            </div>
                            <button type='submit' class='finishingProject btn-grad' data-id='{{id}}' data-uid="{{final_developer}}">Finish</button>
                        </div>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
            loadSocket(projId);
        });
    });

    $(document).on("click", ".finishingProject", function (event) {
        event.preventDefault();
        var projectId = $(this).data("id");
        var devId = $(this).data("uid");
        var obj = {
            projId: projectId,
            userId: devId
        };
        $.post("/user-review-page", obj).then(function () {
            $.get("/user-review").then(function () {
                window.open('/user-review', '_blank');
            })
        })
    });

    function loadSocket(projId) {
        var socket = io();
        // join
        socket.on('connect', function () {
            socket.emit('join', start_up_id, projId, start_up_name);
        });
        // send
        socket.on('msg', function (userName, msg, time) {
            var message = '' +
                '<div class="message">' +
                '  <span class="user bold">' + userName + ' </span>' + '<span class="sysMsg">' + time + '</span>' + '<br>' +
                '<span class="msg">' + msg + '</span>' +
                '</div>';
            $('#msglog').append(message);
            $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
        });

        //load previous history

        socket.on('history', function (history) {
            console.log(history);
            for (var i = 0; i < history.length; i++) {
                var message = '' +
                    '<div class="message">' +
                    '  <span class="user">' + history[i].userName + ': </span>' +
                    '  <span class="msg">' + history[i].message + '</span>' +
                    '</div>' +
                    '<div class="sysMsg">' + history[i].time + '</div>';
                $('#msglog').append(message);
                $('#msglog').scrollTop($('#msglog')[0].scrollHeight);
            }
        })

        // listen
        socket.on('sys', function (sysMsg) {
            var message = '<div class="sysMsg">' + sysMsg + '</div>';
            $('#msglog').append(message);

        });

        // message
        $('#messageInput').keydown(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                var msg = $(this).val();
                $(this).val('');

                socket.send(msg);
            }
        });
    }




    $(document).on("click", ".viewFinalCandidate", function (event) {
        event.preventDefault();
        $(".finalCandidateList").text("");
        var projectId = $(this).data("id");
        var developerId = $(this).data("uid");
        $.get(`/pick/user/${developerId}`).then(function (data) {
            var currList =
                `<li class="finaldeveloper" data-id="${data.id}">${data.first_name}</li>`;
            $(".finalCandidateList").append(currList);
        });
    });

    $(document).on("click", ".finaldeveloper", function (event) {
        event.preventDefault();
        var userId = $(this).data("id");
        loadDevProfile(userId);
    });





    $(document).on("click", ".completeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();
        $.get("/pick/" + projId).then(function (project) {
            $.get(`/pick/rating/${projId}`).then(function (projRating) {
                var currrating = Math.floor(projRating.rating);
                var ratingArray = [];
                var notRatingArray = [];
                for (var i = 1; i <= currrating; i++) ratingArray.push(0);
                for (var i = 1; i <= (5 - currrating); i++) notRatingArray.push(0);
                var addObj = {
                    ratingArr: ratingArray,
                    notRatingArr: notRatingArray
                };
                var bigProject = { ...project, ...projRating, ...addObj };
                var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                            <h3 class='info mb-3'>Project Information</h3>
                                <p class='bold'>TITLE</p>
                                <p>{{title}}</p>
                            </div>
                            <div class='project-description'>
                                <p class='bold'>DESCRIPTION</p>
                                <p>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <p class='bold'>BUDGET</p>
                                <p>$ {{price}}</p>
                            </div>
                            <div class='project-comment'>
                                <p class='bold'>REVIEW DEVELOPER</p>
                                <p>{{comments}}</p>
                            </div>
                            <div class='project-rating'>
                                <p class='bold'>RATE DEVELOPER</p>
                                <P>
                                    {{#each ratingArr}}
                                    <span class="fa fa-star checked"></span>
                                    {{/each}}
                                    {{#each notRatingArr}}
                                    <span class="fa fa-star"></span>
                                    {{/each}}
                                </p>
                            </div>
                            <div>
                            <button data-id='{{id}}' data-uid="{{final_developer}}" class="btn-grad viewFinalCandidate"> View Final Candidate</button>
                            <ul class="list-group finalCandidateList">
                            </ul>
                            </div>`;

                var template = Handlebars.compile(source);
                projView.html(template(bigProject));
            });
        });
    });

    loadStartupNProject();
    var start_up_name;
    var start_up_id;
    function loadStartupNProject() {
        var bigData = {
            startup_name: "",
            startup_email: "",
            startup_intro: "",
            project: [],
            activeProject: [],
            completeProject: [],
        };
        $.get("/api/org_data").then(function (data) {
            start_up_name = data.name;
            start_up_id = data.id;
            $("#registerProjectBtn").attr("data-id", start_up_id);
            bigData.startup_name = data.name;
            bigData.startup_email = data.email;
            bigData.startup_intro = data.intro;
            loadAllProj();
        });

        function loadAllProj() {
            $.get("/api/project").then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status === "Hiring" && data[i].OrgId === start_up_id) {
                        bigData.project.push(data[i]);
                    } else if (data[i].status === "Proccessing" && data[i].OrgId === start_up_id) {
                        bigData.activeProject.push(data[i]);
                    } else if (data[i].status === "Finished" && data[i].OrgId === start_up_id) {
                        bigData.completeProject.push(data[i]);
                    }
                }
                console.log(bigData);
                var source = `<div class="row">
                                <div class="col profile" id="profileView">
                                    <div class="name">
                                    <h1 class="cursive mt-2">Hello.</h1>
                                <p class="p-0 m-0"><i class="fas fa-user icon"></i>{{startup_name}}</p>
                                    </div>
                                    <p class="p-0 m-0"><i class="fas fa-at icon"></i>{{startup_email}}</p>
                                    <p class="p-0 m-0"><i class="fas fa-quote-left icon"></i> {{startup_intro}} <i class="fas fa-quote-right icon"></i></p>
                                    
                                </div>
                            </div>
                                <div class="row" id="startupWindows">
                                    <div class="col-sm-3 overflow-auto" id="projDisp">
                                            <div class="btn-group justify-content-center" role="group" aria-label="Basic example">
                                                <button type="button" class="btn-proj" id="find" data-toggle="tooltip" data-placement="top" title="Available Projects"><i class="fas fa-file-alt iconB"></i></button>
                                                <button type="button" class="btn-proj" id="active" data-toggle="tooltip" data-placement="top" title="Projects in Progress"><i class="fas fa-spinner iconB"></i></button>
                                                <button type="button" class="btn-proj" id="complete" data-toggle="tooltip" data-placement="top" title="Completed Projects"><i class="fas fa-check iconB"></i></button>
                                            </div>
                                            <div class="col-sm-12 overflow-auto" id="projView">
                                                <ul id="findList">
                                                    {{#each project}}
                                                    <li class="project" data-id="{{id}}">
                                                        <hi> {{title}} </hi>
                                                        <p> $ {{price}} </p>
                                                    </li>
                                                    {{/each}}
                                                </ul>
                                                <ul id="activeList" style="display: none">
                                                    {{#each activeProject}}
                                                    <li class="activeproject" data-id="{{id}}">
                                                        <hi> {{title}} </hi>
                                                        <p> {{price}} </p>
                                                    </li>
                                                    {{/each}}
                                                </ul>
                                                <ul id="completeList" style="display: none">
                                                    {{#each completeProject}}
                                                    <li class="completeproject" data-id="{{id}}">
                                                        <hi> {{title}} </hi>
                                                        <p> {{price}} </p>
                                                    </li>
                                                    {{/each}}
                                                </ul>
                                            </div>
                                    </div>
                                    <div class="p-2 col-sm-9 overflow-auto" id="project-display-section">
                                    </div>
                                </div>
                            </div>
                            `;
                var template = Handlebars.compile(source);
                $(".container-fluid").html(template(bigData));
            });
        }
    }


    function loadDevProfile(userId) {
        console.log("test"+userId);
        var bigData = {
            developer_name: "",
            developer_email: "",
            developer_staus: "",
            developer_intro: "",
            developer_rating: 0,
            developer_ratingArr: [],
            developer_notRatingArr: [],
            developer_techniques: [],
            completeProjects: [],
        };
        $.get(`/pick/user/${userId}`).then(function (user) {
            $.get(`/pick/devRating/${userId}`).then(function (devRating) {
                if (devRating) bigData.developer_rating = Math.floor(devRating.rating / devRating.ratingNum);
                for (var i = 1; i <= bigData.developer_rating; i++) bigData.developer_ratingArr.push(0);
                for (var i = 1; i <= 5 - bigData.developer_rating; i++) bigData.developer_notRatingArr.push(0);
                bigData.developer_name = user.first_name;
                bigData.developer_email = user.email;
                bigData.developer_staus = user.status;
                bigData.developer_intro = user.intro;
                var techString = user.techniques;
                var techArray = techString.split(";");
                bigData.developer_techniques = techArray;
                $.get("/api/project").then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].status === "Finished" && data[i].final_developer == userId) {
                            bigData.completeProjects.push(data[i]);
                        }
                    }
                    console.log(bigData);
                    $.post('/dev-profile', bigData).then(function () {
                        $.get('/dev-profile-page').then(function () {
                            window.open('/dev-profile-page', '_blank');
                        })
                    })
                });
            })
        });
    }
});
