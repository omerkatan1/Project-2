$(document).ready(function() {
    // Getting references to our form and input
    var signUpForm = $("form.signupOrg");
    var nameInput = $("input#name-input");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var addressInput = $("input#address-input");
    var introInput = $("#intro-input");
  
    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.on("submit", function(event) {
      event.preventDefault();
      var userData = {
        name: nameInput.val().trim(),
        email: emailInput.val().trim(),
        password: passwordInput.val().trim(),
        address: addressInput.val().trim(),
        intro: introInput.val().trim(),
      };
  
      if (!userData.email || !userData.password) {
        return;
      }
      // If we have an email and password, run the signUpUser function
      signUpOrg(userData);
      nameInput.val("");
      addressInput.val("");
      introInput.val("");
      emailInput.val("");
      passwordInput.val("");
    });
  
    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpOrg(userData) {
      $.post("/api/org-signup", userData)
        .then(function(data) {
          window.location.replace("/org-account");
          // If there's an error, handle it by throwing up a bootstrap alert
        })
        .catch(handleLoginErr);
    }
  
    function handleLoginErr(err) {
      $("#user-alert .msg").text(err.responseJSON);
      $("#user-alert").fadeIn(500);
    }
  });
  