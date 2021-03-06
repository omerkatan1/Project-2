$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var firstName = $("input#firstName-input");
  var lastName = $("input#lastName-input");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var introInput = $("#intro-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      first_name: firstName.val().trim(),
      last_name: lastName.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      intro: introInput.val().trim(),
    };
    console.log(userData);

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData);
    firstName.val("");
    lastName.val("");
    introInput.val("");
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(userData) {
    console.log("here");
    $.post("/api/user-signup", userData)
      .then(function(data) {
        console.log(data);
        window.location.replace("/user-login");

        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#user-alert .msg").text(err.responseJSON);
    $("#user-alert").fadeIn(500);
  }
});
