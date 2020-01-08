$(document).ready(function () {
    $(document).on("click", "#active", function (event) {
        event.preventDefault();
        $("#requestProject").hide();
        $("#findList").hide();
        $("#completeList").hide();
        $("#activeList").show();
    })
    $(document).on("click", "#find", function (event) {
        event.preventDefault();
        $("#requestProject").show();
        $("#findList").show();
        $("#completeList").hide();
        $("#activeList").hide();
    })
    $(document).on("click", "#complete", function (event) {
        event.preventDefault();
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
        var OrgId = $(this).data("id");
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
                                <h3 class='col-sm-12 my-0 p-1'>Project Title:</h3>
                                <p class='col-sm-12 my-0 p-1'>{{title}}</p>
                            </div>
                            <div class='project-description'>
                                <h3 class='col-sm-12 my-0 p-1'>Project Description:</h3>
                                <p class='col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h3 class='col-sm-12 my-0 p-1'>Project Budget:</h3>
                                <p class='col-sm-12 my-0 p-1'>$ {{price}}</p>
                            </div>
                            <div>
                            <button data-id='{{id}}' class="btn-grad m-1 justify-content-left">Load Candidates</button>
                            <ul class="list-group" id="candidateList">
                            </ul>
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
                            var currList = `<li class="developer list-group-item d-flex justify-content-between align-items-center" data-id="${obj.id}"> ${obj.id}. ${obj.first_name} 
                <button class="pickFinalUser" data-id="${obj.id}" data-proj="${obj.projId}">Pick!!!</button>
                </li>`;
                $("#candidateList").append(currList);
                        }
                    }
                }
            });
        });
    });

    $(document).on("click", ".pickFinalUser", function (event) {
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
            var source = `<div class='sticky-top' style='background: white;'>
                            <h6 class='ml16 col-sm-12 my-0 p-1' style='color: black;'>Project: {{title}}</h6>
                            <h6 class='ml16 col-sm-12 my-0 p-1' style='color: black;'>Price: {{price}}</h6>
                            <button type='submit' class='finishProject' data-id='{{id}}' data-uid="{{final_developer}}">Finish!!!</button>
                        </div>
                        <div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='ml16 col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <div>
                            <button data-id='{{id}}' data-uid="{{final_developer}}" class="viewFinalCandidate"> View Final Candidate</button>
                            <ul class="list-group finalCandidateList">

                            </ul>
                            </div>
                            <div class='form-group'>
                                <label for='exampleInputEmail1'>Coment:</label>
                                <textarea type='text' class='form-control' id='startup-comment'
                                    placeholder='How do you think about this developer's work on this project?'></textarea>
                            </div>
                            <button type='submit' class='finishProject' data-id='{{id}}' data-uid="{{final_developer}}">Finish!!!</button>
                        </div>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    $(document).on("click", ".viewFinalCandidate", function (event) {
        event.preventDefault();
        $(".finalCandidateList").text("");
        var projectId = $(this).data("id");
        var developerId = $(this).data("uid");
        $.get(`/pick/user/${developerId}`).then(function (data) {
            var currList =
                `<li class="developer list-group-item d-flex justify-content-between align-items-center" data-id="${data.id}">${data.id}. ${data.first_name}</li>`;
            $(".finalCandidateList").append(currList);
        });
    });


    $(document).on("click", ".finishProject", function (event) {
        event.preventDefault();
        var comment = $("#startup-comment").val().trim();
        var projId = $(this).data("id");
        var userId = $(this).data("uid");
        $.ajax({
            method: "PUT",
            url: `/finishedproject/${projId}`,
        }).then(function () {
            if (userId !== -1) {
                $.ajax({
                    method: "PUT",
                    url: `/update/user/${userId}/1`,
                }).then(function () {
                    location.reload();
                })
            } else location.reload();
        })
    });


    $(document).on("click", ".completeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();
        $.get("/pick/" + projId).then(function (project) {
            var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='ml16 col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <div>
                            <button data-id='{{id}}' data-uid="{{final_developer}}" class="viewFinalCandidate"> View Final Candidate</button>
                            <ul class="list-group finalCandidateList">
                            </ul>
                            </div>`;

            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    loadStartupNProject();
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
            bigData.startup_name = data.name;
            bigData.startup_email = data.email;
            bigData.startup_intro = data.intro;
            loadAllProj();
        });

        function loadAllProj() {
            $.get("/api/project").then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status === "Hiring") {
                        bigData.project.push(data[i]);
                    } else if (data[i].status === "Proccessing") {
                        bigData.activeProject.push(data[i]);
                    } else {
                        bigData.completeProject.push(data[i]);
                    }
                }
                console.log(bigData);
                var source = `<div class="row">
                                <div class="col profile" id="profileView">
                                    <div class="name">
                                    <h1>Hello.</h1>
                                <p class="p-0 m-0"><i class="fas fa-user icon"></i>{{startup_name}}</p>
                                    </div>
                                    <p><i class="fas fa-at icon"></i>{{startup_email}}</p>
                                    <p>{{startup_intro}}</p>
                                    
                                </div>
                            </div>
                                <div class="row" id="startupWindows">
                                    <div class="col-sm-3" id="projDisp">
                                            <div class="btn-group justify-content-center" role="group" aria-label="Basic example">
                                                <button type="button" class="btn-proj" id="find" data-toggle="tooltip" data-placement="top" title="Available Projects"><i class="fas fa-file-alt iconB"></i></button>
                                                <button type="button" class="btn-proj" id="active" data-toggle="tooltip" data-placement="top" title="Projects in Progress"><i class="fas fa-spinner iconB"></i></button>
                                                <button type="button" class="btn-proj" id="complete" data-toggle="tooltip" data-placement="top" title="Completed Projects"><i class="fas fa-check iconB"></i></button>
                                            </div>
                                            <div class="col-sm-12" id="projView">
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
                                    <div class="col-sm-9" id="project-display-section">
                                    </div>
                                </div>
                            </div>
                            <div class="startupFooter">
                                <p>© Sqwash 2020</p>
                            </div>`;
                var template = Handlebars.compile(source);
                $(".container-fluid").html(template(bigData));
            });
        }
    }



});
