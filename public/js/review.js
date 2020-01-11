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
            $.post(`/api/rating/${userId}`, obj).then(function () {
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
        })



    });
});
