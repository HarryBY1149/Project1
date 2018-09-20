$(document).ready(function () {


    var apikey = "601bc82ee545b6f36182813802f81761";
    var app_id = "d008515b";
    var queryUrl = "https://api.edamam.com/api/nutrition-details?app_id=" + app_id + "&app_key=" + apikey;
    var offset = 0;
    $("#submit").on("click", function () {
        var search = $("#search").val().trim();
        var recipeURL = "https://api.edamam.com/search?q=" + search + "&app_id=27bca489&app_key=46b8912e4ad33ceb05a69ea16ca960f7&from=20&to=30&diet=balanced";
        $.ajax({
            url: recipeURL,
            method: "get",
            success: genCards
        })
    })


    function genCards(response) {
        for (var i = 0; i < response.hits.length; i++) {
            console.log(i)
            var recImage = response.hits[i].recipe.image;
            var recTitle = response.hits[i].recipe.label;
            var card = $("<div>");
            if (i === 0) {
                card.addClass("carousel-item active");
            } else {
                card.addClass("carousel-item");
            };
            var cardImage = $("<img>")
            cardImage.attr("src", recImage)
            cardImage.attr("alt", "Delicious Foods")
            var cardLabel = $("<div>")
            cardLabel.addClass("carousel-caption d-none d-md-block")
            cardLabel.append("<h5>" + recTitle + "</h5>");
            card.append(cardImage);
            card.append(cardLabel);
            $("#recipeDisp").append(card);
            if(i === 0){
                $("#carousel-indicators").append("<li data-target:'#myCarousel' data-slide-to='"+i+"' class='active'></li>")
            }else {
                $("#carousel-indicators").append("<li data-target:'#myCarousel' data-slide-to='"+i+"'></li>")
            }
            
        }
    }

})    