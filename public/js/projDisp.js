$(document).ready(function () {
    var find = $("#find");
    var active = $("#axctive");
    var complete = $("#complete");
    var view = $("#view");
    var projView = $("#projView")

    var cpmleteProjects = [
        {
            title: "First project",
            description: "test description",
            price: "$$$",
            status: "Complete",
            developers_list: "you",
            final_developer: "you",

        },
        {
            title: "Second project",
            description: "test description",
            price: "$$$",
            status: "Complete",
            developers_list: "you",
            final_developer: "you",

        }
    ];

    var activeProject = {
        title: "Active project",
        description: "test description",
        price: "$$$",
        status: "Working",
        developers_list: "you",
        final_developer: "you",
    };

    var findProjects = [
        {
            title: "First project",
            description: "test description",
            price: "$$$",
            status: "Hiring",
            developers_list: "still searching",
            final_developer: "maybe you",

        },
        {
            title: "Second project",
            description: "test description",
            price: "$$$",
            status: "Hiring",
            developers_list: "still searching",
            final_developer: "maybe you",

        },
        {
            title: "Third project",
            description: "test description",
            price: "$$$",
            status: "Hiring",
            developers_list: "still searching",
            final_developer: "maybe you",

        },
        {
            title: "Fourth project",
            description: "test description",
            price: "$$$",
            status: "Hiring",
            developers_list: "still searching",
            final_developer: "maybe you",

        }

    ];

    
        active.click(function() {
            projView.empty();
            projView.append(JSON.stringify(activeProject));
        });

        find.click(function() {
            projView.empty();
            projView.append(JSON.stringify(findProjects));
        })

        complete.click(function() {
            projView.empty();
            projView.append(JSON.stringify(completeProjects));
        })

        view.click(function() {
            alert("sending data object to display window!");
        })
});