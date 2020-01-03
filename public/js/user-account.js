$(document).ready(function () {
  var currStatus;
  var currId;
  $.get("/api/user_data").then(function (data) {
    $(".user-name").text(data.first_name + " " + data.last_name);
    $(".user-email").text(data.email);
    $(".user-bio").text(data.intro);
    // $(".projectList").text("");
    // $(".biddedprojectList").text("");
    // $(".finishedprojectList").text("");
    currStatus = data.status;
    currId = data.id;
    currBid = data.biddedProject;
    loadAllProj(currStatus, currBid);
    loadCurrProj(currStatus, currBid);
  });


  function loadAllProj(currStatus, currBid) {
    var currBidArray = currBid.split(";");
    console.log(currBidArray);
    $.get("/api/project").then(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].status === "Hiring" && !currBidArray.includes((data[i].id.toString()))) {
          var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
          if (!currStatus && currBidArray.length < 5)
            currProject += `<button data-id="${data[i].id}" class="bidProject">Bid it!!!</button>`;
          else currProject += `<button data-id="${data[i].id}" class="bidProject" disabled>Bid it!!!</button>`;
          $(".projectList").append(currProject);
        }
        if (data[i].status === "Finished" && data[i].final_developer === currId) {
          var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
          $(".finishedprojectList").append(currProject);
        }
      }
    });
  }

  function loadCurrProj(currStatus, currBid) {
    console.log(currBid);
    $.get("/api/project").then(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (currStatus) {
          if (data[i].status === "Proccessing" && data[i].final_developer === currId) {
            var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
            currProject += `<button data-id="${data[i].id}" class="bidProject" disabled>Ongoing!!!</button>`;
            $(".biddedprojectList").append(currProject);
          }
        } else {
          var currBidArray;
          console.log(currBid);
          if (currBid.length > 1) currBidArray = currBid.split(";");
          else currBidArray = [currBid.toString()];
          console.log(currBidArray);
          console.log(currBidArray.includes(data[i].id.toString()));
          if (data[i].status === "Hiring" && currBidArray.includes((data[i].id.toString()))) {
            var currProject = `<ul style="list-style-type:none;">
        <li class="title">${data[i].title}</li>
        <li class="description">${data[i].description}</li>
        <li class="price">${data[i].price}</li>`;
            currProject += `<button data-id="${data[i].id}" class="bidProject" disabled>Bidded!!!</button> <button data-id="${data[i].id}" class="quitProject">Quit!!!</button>`;
            $(".biddedprojectList").append(currProject);
          }
        }
      }
    });
  }

  $(document).on("click", ".bidProject", function (data) {
    var projId = $(this).data("id");
    $.ajax({
      method: "PUT",
      url: `/user/${currId}/${projId}`,
    }).then(function () {
      $.ajax({
        method: "GET",
        url: `/project/${projId}/${currId}`,
      }).then(function () {
        location.reload(); //attention here
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
        url:`/removeCandidate/project/${projId}/${currId}`
      }).then(function () {
        location.reload();
      })
    });
  });


});
