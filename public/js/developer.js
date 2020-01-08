$(document).ready(function () {
    $(document).on("click", "#active", function (event) {
        event.preventDefault();
        $("#findList").hide();
        $("#completeList").hide();
        $("#activeList").show();
    })
    $(document).on("click", "#find", function (event) {
        event.preventDefault();
        $("#findList").show();
        $("#completeList").hide();
        $("#activeList").hide();
    })
    $(document).on("click", "#complete", function (event) {
        event.preventDefault();
        $("#findList").hide();
        $("#completeList").show();
        $("#activeList").hide();
    })

    $(document).on("click", ".project", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <div class='form-group'>
                                <label for='exampleInputEmail1'>Why are you qualified?:</label>
                                <textarea type='text' class='form-control' id='user-bid-input'
                                    placeholder='why you are the right candidate?'></textarea>
                            </div>
                        </div>

                        <button type='submit' class='bidProject btn-grad' data-id='{{id}}'>Bid it!!!</button>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    $(document).on("click", ".activeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            if (project.status==="Hiring"){
                project.start = true;
            }
            var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <button type='submit' class='{{#if start}}quitProject{{/if}} btn-grad' data-id='{{id}}'>{{#if start}}Quit It!!!{{else}}Ongoing!!!{{/if}}</button>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });


    $(document).on("click", ".completeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            var source = `<div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <button type='submit' class='btn-grad' data-id='{{id}}'>Done!!!</button>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    loadUserNProject();
    var currStatus;
    var currId;
    function loadUserNProject() {
        var bigData = {
            developer_name: "",
            developer_email: "",
            project: [],
            activeProject: [],
            completeProject: [],
        };
        $.get("/api/user_data").then(function (data) {
            // $(".user-name").text(data.first_name + " " + data.last_name === null ? "" : data.last_name);
            // $(".user-email").text(data.email);
            // $(".user-bio").text(data.intro);
            bigData.developer_name = data.first_name;
            bigData.developer_email = data.email;
            currStatus = data.status;
            currId = data.id;
            currBid = data.biddedProject;
            loadAllProj(currStatus, currBid);
        });

        function loadAllProj(currStatus, currBid) {
            var currBidArray = currBid.split(";");
            $.get("/api/project").then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status === "Finished" && data[i].final_developer === currId) {
                        bigData.completeProject.push(data[i]);
                    }
                    if (currStatus) {
                        if (data[i].status === "Proccessing" && data[i].final_developer === currId) {
                            bigData.activeProject = [];
                            bigData.activeProject.push(data[i]);
                        }
                        if (data[i].status === "Hiring") {
                            bigData.project.push(data[i]);
                        }
                    } else {
                        var currBidArray;
                        if (currBid.length > 1) currBidArray = currBid.split(";");
                        else currBidArray = [currBid.toString()];
                        if (data[i].status === "Hiring" && !currBidArray.includes((data[i].id.toString()))) {
                            bigData.project.push(data[i]);
                        }
                        if (data[i].status === "Hiring" && currBidArray.includes((data[i].id.toString()))) {
                            bigData.activeProject.push(data[i]);
                        }
                    }
                }
                var source = `<div class="row">
                                <div class="col profile" id="profileView">
                                    <div class="name">
                                        <h1>Hello, {{developer_name}}</h1>
                                    </div>
                                    <p>User Email: {{developer_email}}</p>
                                    <p>Bio: {{developer_intro}}</p>
                                </div>
                            </div>
                            <div class="row" id="startupWindows">
                                <div class="col-sm-3" id="projDisp">
                                    <div class="container-fluid projDisp">
                                        <div class="btn-group" role="group" aria-label="Basic example">
                                            <button type="button" class="btn-proj btn-secondary" id="find">Find</button>
                                            <button type="button" class="btn-proj btn-secondary" id="active">Active</button>
                                            <button type="button" class="btn-proj btn-secondary" id="complete">Complete</button>
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
                                </div>
                            
                                <div class="p-0 col-sm-9" id="project-display-section">
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

    $(document).on("click", ".bidProject", function (data) {
        var projId = $(this).data("id");
        var bidContent = $("#user-bid-input").val().trim();
        var bidAppData = {
            project_id: projId,
            bid_content: bidContent,
            UserId: currId,
        };
        $.ajax({
            method: "PUT",
            url: `/user/${currId}/${projId}`,
        }).then(function () {
            $.ajax({
                method: "GET",
                url: `/project/${projId}/${currId}`,
            }).then(function () {
                $.post(`/bid/application`, bidAppData)
                    .then(function () {
                        location.reload();
                    })
            })
        });
    });

    $(document).on("click", ".quitProject", function (data) {
        var projId = $(this).data("id");
        $.ajax({
            method: "PUT",
            url: `/user/bidded/${projId}/${currId}`,
        }).then(function () {
            $.ajax({
                method: "PUT",
                url: `/removeCandidate/project/${projId}/${currId}`
            }).then(function () {
                location.reload();
            })
        });
    });


});
