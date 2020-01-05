$(document).ready(function () {
    $("#active").on("click", function (event) {
        event.preventDefault();
        console.log("test");
        $("#findList").hide();
        $("#completeList").hide();
        $("#activeList").show();
    })
    $("#find").on("click", function (event) {
        event.preventDefault();
        $("#findList").show();
        $("#completeList").hide();
        $("#activeList").hide();
    })
    $("#complete").on("click", function (event) {
        event.preventDefault();
        $("#findList").hide();
        $("#completeList").show();
        $("#activeList").hide();
    })

    $(".project").on("click", function (event) {
        event.preventDefault();
        console.log("here");
        var projId = $(this).data("id");
        console.log(projId);
        var projView = $("#project-display-section");
        projView.empty();

        $.get("/pick/" + projId).then(function (project) {
            // project = {
            //     title: "norman",
            //     description: "something",
            //     price: 100
            // };
            console.log(project);
            var source = `<div class='sticky-top' style='background: white;'>
                            <h6 class='ml16 col-sm-12 my-0 p-1' style='color: black;'>Project: Bootstrap</h6>
                            <h6 class='ml16 col-sm-12 my-0 p-1' style='color: black;'>Start-up: UW</h6>
                            <button type='submit' class='btn-grad'>Bid it!!!</button>
                        </div>
                        <div class='project-content mt-3'>
                            <div class='project-title'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Title:</h6>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>{{title}}</h6>
                            </div>
                            <div class='project-description'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Description:</h6>
                                <p class='ml16 col-sm-12 my-0 p-1'>{{description}}</p>
                            </div>
                            <div class='project-price'>
                                <h6 class='ml16 col-sm-12 my-0 p-1'>Project Budget:</h6>
                                <p>{{price}}</p>
                            </div>
                            <div class='form-group'>
                                <label for='exampleInputEmail1'>why you are fit:</label>
                                <textarea type='text' class='form-control' id='user-bid-input'
                                    placeholder='why you are the right candidate?'></textarea>
                            </div>
                        </div>

                        <button type='submit' class='btn-grad'>Bid it!!!</button>`;
            console.log(source);
            var template = Handlebars.compile(source);
            console.log(template(project));
            projView.html(template(project));
        });



    });

});
