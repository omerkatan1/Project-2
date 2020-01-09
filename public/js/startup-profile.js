$(document).ready(function () {
    // get user info object
    //  1. build empty object for values needed to populate user info box
    function getUserInfo() {
        var bigData = {
            startup_name: "",
            startup_email: "",
            startup_intro: "",
            Projects: [],
        };
        //  2. get user id. api call to /spi/org-data
        $.get("/api/org_data").then(function (data) {
            bigData.startup_name= data.name;
            bigData.startup_email= data.email;
            bigData.startup_intro= data.intro;
            loadCompleteProjects();
        });
        function loadCompleteProjects() {
            $.get("/api/project").then(function (data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status === "Finished") {
                        bigData.Projects.push(data[i]);
                    }
                }
                console.log(bigData);
                var source = `<div class="row justify-content-center">
                                <div class="col-sm-4 box" id="user-image">
                                    <img src="img/sqwashAvater.jpg" alt="profile-image" id="avatar">
                                </div>
                            </div>
                            <div class="row justify-content-around">
                                <div class="col-sm-6 box" id="user-view">
                                    <p>User Name: {{startup_name}}</p>
                                    <p>Email: {{startup_email}}</p>
                                    <p>User Rating</p>
                                    <p>User Bio: {{startup_intro}}</p>
                                </div>
                            <div class="col-sm-6 box" id="completed-view">
                                <ul id="completeList">
                                    {{#each completeProject}}
                                    <li class="completeprojects" data-id="{{id}}">
                                        <hi> {{title}} </hi>
                                        <p> {{price}} </p>
                                    </li>
                                    {{/each}}
                                </ul>
                            </div>
                        </div>`;
    
                var template = Handlebars.compile(source);
                $("#profile-main").html(template(bigData));
            })
        }
    };
    getUserInfo();
    //  4. pass object to template literal (html model) defined as var source
    //  5. handlebars.compile(source) defined as var template
    //  6. element.html(template(pass data object here))
    // get completed project list
    // 
    });