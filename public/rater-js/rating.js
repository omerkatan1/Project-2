var starRating1;

function onload(event) {

    var myDataService = {
        rate: function (rating) {
            return {
                then: function (callback) {
                    setTimeout(function () {
                        callback((Math.random() * 5));
                    }, 1000);
                }
            }
        }
    }

    starRating1 = raterJs({
        starSize: 40,
        element: document.querySelector("#rater"),
        rateCallback: function rateCallback(rating, done) {
            this.setRating(rating);
            done();
        }
    });
}

window.addEventListener("load", onload, false); 
