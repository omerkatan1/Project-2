$(document).ready(function () {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/org_data").then(function (data) {
        $(".org-name").text(data.name);
        $(".org-email").text(data.email);
        $(".org-address").text(data.address);
        $(".org-bio").text(data.intro);
        $(".createProject").attr("data-id", data.id);
    });
    $.get("/api/project").then(function (data) {
        for (var i = 0; i < data.length; i++) {
            var currProject = `<ul style="list-style-type:none;">
            <li class="title">${data[i].title}</li>
            <li class="description">${data[i].description}</li>
            <li class="price">${data[i].price}</li>`;
            if (data[i].status === "Hiring") {
                currProject += `<button data-id="${data[i].id}" data-toggle="modal" data-target="#pickCandidate" class="pickCandidate">Pick Candidate</button>`;
                currProject += `<button data-uid="-1" data-id="${data[i].id}" class="finishProject">Finished!!!</button></ul>`;
                $(".hiringprojectList").append(currProject);
            } else if (data[i].status === "Proccessing") {
                currProject += `<li class="workingUser">${data[i].final_developer}</li>`;
                currProject += `<button data-uid="${data[i].final_developer}" data-id="${data[i].id}" class="finishProject">Finished!!!</button></ul>`;
                $(".proccessingprojectList").append(currProject);
            } else {
                currProject += `<li class="finishedUser">${data[i].final_developer}</li>`;
                $(".finishedprojectList").append(currProject);
            }
        }
    });

    $(document).on("click", ".finishProject", function (event) {
        event.preventDefault();
        var projId = $(this).data("id");
        var userId = $(this).data("uid");
        console.log(userId);
        $.ajax({
            method: "PUT",
            url: `/finishedproject/${projId}`,
        }).then(function () {
            if (userId !== -1) {
                $.ajax({
                    method: "PUT",
                    url: `/user/${userId}/1`,
                }).then(function () {
                    location.reload();
                })
            }else location.reload();
        })
    });

    $(document).on("click", ".pickCandidate", function (event) {
        event.preventDefault();
        $("#candidateList").text("");
        var projectId = $(this).data("id");
        console.log(projectId);
        $.get(`/pick/${projectId}`, function (project) {
            console.log(project);
            var devList = project.developers_list;
            $.get("/api/users").then(function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (devList.includes(data[i].id.toString())) {
                            var currList =
                                `<li class="list-group-item d-flex justify-content-between align-items-center"> ${data[i].first_name} ${data[i].email}
                            <button class="pickFinalUser" data-id="${data[i].id}" data-proj="${projectId}" data-dismiss="modal">Pick!!!</button>
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
            location.reload();
        })
    });

    $("#submitProject").on("click", function (event) {
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
        handleProject(newProject);
        $("#title-input").val("");
        $("#description-input").val("");
        $("#price-input").val("");
    });

    function handleProject(newProject) {
        $.post("/api/project", newProject)
            .then(function (data) {
                location.reload();
            })
            .catch(handleLoginErr);
    }


    function handleLoginErr(err) {
        $("#user-alert .msg").text(err.responseJSON);
        $("#user-alert").fadeIn(500);
    }
});
