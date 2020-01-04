$(document).ready(function () {
    // Getting references to our form and input
    var signUpForm = $("form.join");
    var nameInput = $("input#firstName-input");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var introInput = $("#intro-input");

    var userType;


    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.on("submit", function (event) {
        event.preventDefault();
        var name = nameInput.val().trim();
        var firstName = name.split(" ")[0];
        var lastName = name.split(" ")[1];
        var technologyList = document.getElementsByClassName("techcheckbox");
        var checkedtechlist = "";
        for (var i = 0; i < technologyList.length; i++) {
            if (technologyList[i].checked) {
                if (checkedtechlist.length === 0) checkedtechlist += technologyList[i].value;
                else checkedtechlist += `;${technologyList[i].value}`;
            }
        }
        console.log(checkedtechlist);
        userType = $("#sod").val();
        console.log(userType);
        if (userType === "Developer") {
            var userData = {
                first_name: firstName,
                last_name: lastName,
                email: emailInput.val().trim(),
                password: passwordInput.val().trim(),
                intro: introInput.val().trim(),
                techniques: checkedtechlist,
            };
            console.log(userData);

            if (!userData.email || !userData.password) {
                return;
            }
            // If we have an email and password, run the signUpUser function
            signUpUser(userData);
        } else {
            var userData = {
                name: nameInput.val().trim(),
                email: emailInput.val().trim(),
                password: passwordInput.val().trim(),
                intro: introInput.val().trim(),
            };

            if (!userData.email || !userData.password) {
                return;
            }
            // If we have an email and password, run the signUpUser function
            signUpOrg(userData);

        }
        nameInput.val("");
        introInput.val("");
        emailInput.val("");
        passwordInput.val("");
    });

    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors
    function signUpUser(userData) {
        $.post("/api/user-signup", userData)
            .then(function (data) {
                window.location.replace("/");
                // If there's an error, handle it by throwing up a bootstrap alert
            })
            .catch(handleLoginErr);
    }

    function signUpOrg(userData) {
        $.post("/api/org-signup", userData)
            .then(function (data) {
                window.location.replace("/");
                // If there's an error, handle it by throwing up a bootstrap alert
            })
            .catch(handleLoginErr);
    }

    function handleLoginErr(err) {
        $("#user-alert .msg").text(err.responseJSON);
        $("#user-alert").fadeIn(500);
    }
});
