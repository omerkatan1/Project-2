$(document).ready(function () {
    $(document).on("click", ".finishProject", function (event) {
        event.preventDefault();
        var projId = $(this).data("pid");
        var userId = $(this).data("uid");
        var currRate = $("#rater").data("rating");
        var comment = $("#comment").val().trim();
        $.ajax({
            method: "PUT",
            url: `/finishedproject/${projId}`,
        }).then(function () {
            if (userId !== -1) {
                $.ajax({
                    method: "PUT",
                    url: `/update/user/${userId}/1`,
                }).then(function () {
                    location.reload();
                })
            } else location.reload();
        })
    });
});
