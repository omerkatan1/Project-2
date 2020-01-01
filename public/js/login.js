$(document).ready(function() {
  // Getting references to our form and inputs
  var loginForm = $("form.login");
  var userInput = $("input#user-input");
  var passInput = $("input#pass-input");

  // When the form is submitted, we validate there's an username and password entered
  loginForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      username: userInput.val().trim(),
      password: passInput.val().trim()
    };

    if (!userData.username || !userData.password) {
      return;
    }

    // If we have an username and password we run the loginUser function and clear the form
    loginUser(userData.username, userData.password);
    userInput.val("");
    passInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(username, password) {
    $.post("/api/login", {
      username: username,
      password: password
    })
      .then(function() {
        window.location.replace("/members");
        // If there's an error, log the error
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});
