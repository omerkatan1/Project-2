$(document).ready(function () {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/org_data").then(function (data) {
        $(".org-name").text(data.name);
        $(".org-email").text(data.email);
        $(".org-address").text(data.address);
        $(".org-bio").text(data.intro);
        console.log(data.id);
        $(".createProject").attr("data-id", data.id);
    });

    $.get("/api/project").then(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var currProject = `<ul style="list-style-type:none;">
            <li class="title">${data[i].title}</li>
            <li class="description">${data[i].description}</li>
            <li class="price">${data[i].price}</li>`;
            if (!data[i].status) {
                currProject += `<button data-id="${data[i].id}" data-toggle="modal" data-target="#pickCandidate" class="pickUser">Pick Candidate</button>`;
                if (data[i].final_developer === -1) {
                    currProject += `<button data-id="${data[i].id}" class="finishProject">Finished!!!</button></ul>`;
                }else currProject += `<button data-id="${data[i].id}" class="finishProject" disabled>Finished!!!</button></ul>`;
            }else{
                currProject += `<button data-id="${data[i].id}" data-toggle="modal" data-target="#pickCandidate" class="pickUser" disabled>Pick Candidate</button>`;
                if (data[i].final_developer === -1) {
                    currProject += `<button data-id="${data[i].id}" class="finishProject">Finished!!!</button></ul>`;
                }else currProject += `<button data-id="${data[i].id}" class="finishProject" disabled>Finished!!!</button></ul>`;
            }
            $(".projectList").append(currProject);
        }
    });

    $(".pickUser").on("click", function (event) {
        event.preventDefault();
        var projectId = $(this).data("id");
        $.get("/api/users").then(function (data) {
            for (var i = 0; i < data.length; i++) {
                if (!data[i].status) {
                    var currList =
                        `<li class="list-group-item d-flex justify-content-between align-items-center"> ${data[i].first_name} ${data[i].email}
                        <button class="pickFinalUser" data-id="${data[i].id}" data-proj="${projectId}" data-dismiss="modal">Pick!!!</button>
                        </li>`;
                    $("#candidataList").append(currList);
                }
            }
        });
    });

    $(".pickFinalUser").on("click", function (event) {
        event.preventDefault();
        
    })

    $("#submitProject").on("click", function (event) {
        event.preventDefault();
        var title = $("#title-input").val().trim();
        var description = $("#description-input").val().trim();
        var price = $("#price-input").val().trim();
        var organization_id = $(this).data("id");
        var newProject = {
            title: title,
            description: description,
            price: price,
            organization_id: organization_id
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
