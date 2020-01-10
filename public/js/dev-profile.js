$(document).ready(function () {
    $(document).on("click",".completeproject",function(event){
        event.preventDefault();
        var projId = $(this).data("id");
        $.get(`/pick/${projId}`).then(function(data){
            $("#modalProjectTitle").html(data.title);
            $("#modalProjectDescription").html(data.description);
            $("#modalProjectPrice").html(data.price);
            $("#completeprojectinfo").modal();
        });
    });









// get user info object
//  1. build empty object for values needed to populate user info box
// function getUserInfo() {
//     var bigData = {
//         developer_name: "",
//         developer_email: "",
//         developer_staus: "",
//         developer_intro: "",
//         developer_techniques: [],
//         completeProjects: [],
//     };
//     //  2. get user id. api call to /spi/org-data
//     $.get("/api/org_data").then(function (data) {
//         bigData.developer_name= data.first_name + ' ' + data.last_name;
//         bigData.developer_email= data.email;
//         bigData.developer_staus= data.status;
//         bigData.developer_intro= data.intro;
//         var techString = data.techniques;
//         var techArray = techString.split(";");
//         bigData.developer_techniques = techArray;
//         console.log(bigData.developer_techniques);
//         loadCompleteProjects();
//     });
//     function loadCompleteProjects() {
//         $.get("/api/project").then(function (data) {
//             console.log(data);
//             for (var i = 0; i < data.length; i++) {
//                 if (data[i].status === "Finished") {
//                     bigData.completeProjects.push(data[i]);
//                 }
//             }
//             console.log(bigData);
//             var source = `<div class="row justify-content-center">
//                             <div class="col-sm-4" id="user-image">
//                                 <img src="img/sqwashAvater.jpg" alt="profile-image" id="avatar">
//                             </div>
//                         </div>
//                         <div class="row justify-content-around" id="user-view">
//                             <div class="col-sm-6">
//                                 <p>User Name: {{developer_name}}</p>
//                                 <p>User Email: {{developer_email}}</p>
//                                 <p>Available for hire? {{developer_status}}</p>
//                                 <p>User Rating</p>
//                                 <p>User Bio: {{developer_intro}}</p>
//                                 <p>User Tech:</p>
//                                 <ul>
//                                     {{#each developer_techniques}}
//                                     <li>
//                                         <p>{{this}}</p>
//                                     </li>
//                                     {{/each}}
//                                 </ul>
//                             </div>
//                             <div class="col-sm-6" id="completed-view">
//                                 <ul id="completeList">
//                                     {{#each completeProjects}}
//                                     <li class="completeproject" data-id="{{id}}">
//                                         <hi> {{title}} </hi>
//                                         <p> {{price}} </p>
//                                     </li>
//                                     {{/each}}
//                                 </ul>
//                             </div>
//                         </div>`;

//             var template = Handlebars.compile(source);
//             $("#profile-main").html(template(bigData));
//         })
//     }
// };
// getUserInfo();
//  4. pass object to template literal (html model) defined as var source
//  5. handlebars.compile(source) defined as var template
//  6. element.html(template(pass data object here))
// get completed project list
// 
});
