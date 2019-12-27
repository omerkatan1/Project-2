$(document).ready(function () {
  var currStatus;
  var currId;
  $.get("/api/user_data").then(function (data) {
    console.log(data);
    $(".user-name").text(data.first_name + " " + data.last_name);
    $(".user-email").text(data.email);
    $(".user-bio").text(data.intro);
    // $(".projectList").text("");
    currStatus = data.status;
    currId = data.id;
    console.log(currStatus);
    if (!currStatus) loadAllProj();
    else loadCurrProj();
  });


  function loadAllProj() {
    $.get("/api/project").then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        if (data[i].status === "Hiring") {
          var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
          currProject += `<button data-id="${data[i].id}" class="bidProject">Bid it!!!</button>`;
          $(".projectList").append(currProject);
        }
        if (data[i].status === "Finihsed" && data[i].final_developer===currId) {
          var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
          $(".finishedprojectList").append(currProject);
        }
      }
    });
  }

  function loadCurrProj() {
    $.get("/api/project").then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        if (data[i].status === "Proccessing" && data[i].final_developer===currId) {
          var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
          currProject += `<button data-id="${data[i].id}" class="bidProject" disabled>Bid it!!!</button>`;
          $(".projectList").append(currProject);
        }
        if (data[i].status === "Finihsed" && data[i].final_developer===currId) {
          var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
          $(".finishedprojectList").append(currProject);
        }
      }
    });

  }

  $(document).on("click", ".bidProject", function (data) {
    var projId = $(this).data("id");
    updateInfo(projId);
  });

  function updateInfo(projId) {
    var currStatusNum = currStatus ? 1 : 0;
    $.ajax({
      method: "PUT",
      url: `/user/${currId}/${currStatusNum}`,
    }).then(function () {
      $.ajax({
        method: "GET",
        url: `/project/${projId}/${currId}`,
      }).then(function () {
        console.log("here");
        location.reload(); //attention here
      })
    });
  }
});
