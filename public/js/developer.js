$(document).ready(function () {
    $(document).on("click", "#active", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#findList").hide();
        $("#completeList").hide();
        $("#activeList").show();
    })
    $(document).on("click", "#find", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
        $("#findList").show();
        $("#completeList").hide();
        $("#activeList").hide();
    })
    $(document).on("click", "#complete", function (event) {
        event.preventDefault();
        $("#project-display-section").html("");
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
                            <div class='form-group'>
                                <label for='exampleInputEmail1'>Why are you qualified? (You can write up to 1000 characters):</label>
                                <textarea type='text' class='form-control' id='user-bid-input'
                                    placeholder='Why are you the right candidate?'></textarea>
                            </div>
                        </div>

                        <button type='submit' class='bidProject btn-grad' data-id='{{id}}'>Apply</button>`;
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
            if (project.status === "Hiring") {
                project.start = true;
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
                        <button type='submit' class='{{#if start}}quitProject{{/if}} btn-grad' data-id='{{id}}'>{{#if start}}Quit{{else}}Ongoing{{/if}}</button>`;
                var template = Handlebars.compile(source);
                projView.html(template(project));
            } else {
                project.start = false;
                var source = `
            <div class='project-content mt-3'>
            <h3 class='info mb-3'>Project Information</h3>
            <div class='project-title'>
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
                <h3 class="bold">CHAT NOW</h3>
                <div class="container-fluid justify-content-center">
                                <div class ="chatBox col" id="msglog">
                                </div>
                                <textarea name="message" class="col p-1" id="messageInput" placeholder="Enter chat content here"></textarea>
                            <div>
                                Press Enter to Send!
                            </div>
                            </div>
                <button type='submit' class='{{#if start}}quitProject{{/if}} btn-grad' data-id='{{id}}'>{{#if start}}Quit Project{{else}}Ongoing Project{{/if}}</button>`;
                var template = Handlebars.compile(source);
                projView.html(template(project));
                loadSocket(projId);
            }
        });
    });

   
    function loadSocket(projId) {
        var socket = io();
        //var socket = io();
        // join
        socket.on('connect', function () {
            socket.emit('join', currId, projId, currDevName);
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




    $(document).on("click", ".completeproject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            var source = `
                        <div class='project-content mt-3'>
                        <div class='project-title'>
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
                            <button type='submit' class='btn-grad' data-id='{{id}}'>Done</button>`;
            var template = Handlebars.compile(source);
            projView.html(template(project));
        });
    });

    loadUserNProject();
    var currStatus;
    var currId;
    var currDevName;
    function loadUserNProject() {
        var bigData = {
            developer_name: "",
            developer_email: "",
            developer_intro: "",
            project: [],
            activeProject: [],
            completeProject: [],
        };
        $.get("/api/user_data").then(function (data) {
            // $(".user-name").text(data.first_name + " " + data.last_name === null ? "" : data.last_name);
            // $(".user-email").text(data.email);
            // $(".user-bio").text(data.intro);
            currDevName = data.first_name;
            bigData.developer_name = data.first_name;
            bigData.developer_email = data.email;
            bigData.developer_intro = data.intro;
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
                                <h1 class="cursive mt-2">Hello.</h1>
                            <p class="p-0 m-0"><i class="fas fa-user icon"></i>{{developer_name}}</p>
                                </div>
                                <p class="p-0 m-0"><i class="fas fa-at icon"></i>{{developer_email}}</p>
                                <p class="p-0 m-0"><i class="fas fa-quote-left icon"></i>{{developer_intro}} <i class="fas fa-quote-right icon"></i></p>
                                </div>
                            </div>
                            <div class="row" id="startupWindows">
                                <div class="col-sm-3 overflow-auto" id="projDisp">
                                    <div class="container-fluid projDisp">
                                        <div class="btn-group" role="group" aria-label="Basic example">
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

    $(document).on("click","#loadDevProfile",function(event){
        event.preventDefault();
        loadDevProfile(currId);
    });
    function loadDevProfile(userId) {
        console.log("test");
        var bigData = {
            developer_name: "",
            developer_email: "",
            developer_staus: "",
            developer_intro: "",
            developer_techniques: [],
            completeProjects: [],
        };
        $.get(`/pick/user/${userId}`)
            .then(function (user) {
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
                    $.post('/dev-profile',bigData).then(function(){
                        $.get('/dev-profile-page').then(function(){
                            window.open('/dev-profile-page','_blank');
                        })
                    })
                });
            });
    }


});
