$(document).ready(function () {
    $(document).on("click", ".finishProject", function (event) {
        event.preventDefault();
        var ProjId = $(this).data("pid");
        var UserId = $(this).data("uid");
        var currRate = $("#rater").data("rating");
        var comment = $("#comment").val().trim();

        console.log(currRate);
        console.log(comment);
        var obj = {
            rating: currRate,
        };

        var objP = {
            rating: currRate,
            comments: comment,
            projId: ProjId,
            userId: UserId
        };

        $.post(`/api/projectReviews`, objP).then(function () {
            $.post(`/api/rating/${UserId}`, obj).then(function () {
                $.ajax({
                    method: "PUT",
                    url: `/finishedproject/${ProjId}`,
                }).then(function () {
                    if (UserId !== -1) {
                        $.ajax({
                            method: "PUT",
                            url: `/update/user/${UserId}/1`,
                        }).then(function () {
                            window.close();
                        })
                    } else window.close();
                })
            });
        })



    });
});
