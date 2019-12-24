$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/org_data").then(function(data) {
      $(".org-name").text(data.name);
      $(".org-email").text(data.email);
      $(".org-address").text(data.address);
      $(".org-bio").text(data.intro);
    });
  });
  