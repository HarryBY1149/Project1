$(document).ready(function () {


    var apikey = "601bc82ee545b6f36182813802f81761";
    var app_id = "d008515b";
    var queryUrl = "https://api.edamam.com/api/nutrition-details?app_id=" + app_id + "&app_key=" + apikey;
    var offset1 = 0;
    var offset2 = 10;
    var displayed = false;
    var healthArray = [];
    var healthString = ""
    if (healthArray.length !== 0) {
        healthString = healthArray.join("");
    } else {
        healthString = "";
    }




    $("#submit").on("click", function () {
        $("#recipeDisp").empty();
        $("#carousel-indicators").empty();
        offset1 = 0;
        offset2 = 10;
        console.log(healthString)
        primarySearch();
    })

    $("#add-more").on("click", function () {
        offset1 += 10;
        offset2 += 10;
        primarySearch();

    })

    function primarySearch() {
        var search = $("#search").val().trim();
        var from = offset1;
        var to = offset2;
        var recipeURL = "https://api.edamam.com/search?q=" + search + "&app_id=cae126c9&app_key=c5ce740a41e85392d651319a8ae31a99&from=" + from + "&to=" + to + "&diet=balanced" + healthString;
        $.ajax({
            url: recipeURL,
            method: "get",
        }).then(function (response) {
            genCards(response);
            console.log(response);
        })
    }

    function genCards(response) {
        for (var i = 0; i < response.hits.length; i++) {
            var recImage = response.hits[i].recipe.image;
            var recTitle = response.hits[i].recipe.label;
            var card = $("<div>");
            if ((i === 0) && ($(".carousel-item.active").length === 0)) {
                card.addClass("carousel-item active");
            } else {
                card.addClass("carousel-item");
            };
            card.attr("data-id", recTitle)
            var cardImage = $("<img>")
            cardImage.attr("src", recImage)
            cardImage.attr("alt", "Delicious Foods")
            var cardLabel = $("<div>")
            cardLabel.addClass("carousel-caption d-none d-md-block")
            cardLabel.append("<h5>" + recTitle + "</h5>");
            card.append(cardImage);
            card.append(cardLabel);
            $("#recipeDisp").append(card);
            if ((i === 0) && ($("#carousel-indicators.active").length === 0)) {
                $("#carousel-indicators").append("<li data-target:'#myCarousel' data-slide-to='" + i + "' class='active'></li>")
            } else {
                $("#carousel-indicators").append("<li data-target:'#myCarousel' data-slide-to='" + i + "'></li>")
            }

        }
    }

    $(document).on("click", ".carousel-item", function () {
        var queryID = $(this).attr("data-id");
        var secondaryURL = "https://api.edamam.com/search?q=" + queryID + "&app_id=cae126c9&app_key=c5ce740a41e85392d651319a8ae31a99&diet=balanced";
        $.ajax({
            url: secondaryURL,
            method: "get"
        }).then(function (response) {
            console.log(response)
            var directionsURL = response.hits[0].recipe.url;
            var ingredients = response.hits[0].recipe.ingredients;
            var totalDaily = response.hits[0].recipe.totalDaily;
            ingredientBreakout(ingredients);

        })
    })

    function ingredientBreakout(ingredients) {
        var ingredientDiv = $("<div>")
            ingredientDiv.append("<h2>Ingredients</h2>")
            ingredientDiv.addClass("col-md-10 text-left float-left")
        for (var j = 0; j<ingredients.length; j++){
            var ingredientLine = $("<p>")
            ingredientLine.text(ingredients[j].text);
            ingredientDiv.append(ingredientLine);
        }
        $("#recipeDetails").append(ingredientDiv);
    };
    $(document).on("click", "#checkLabel", function () {
        if (displayed === false) {
            $(".preferences").css("display", "block");
            displayed = true;
        } else {
            $(".preferences").css("display", "none");
            displayed = false;
        }
    })

    $(":checkbox").on("click", function () {
        if ($(this).is(":checked")) {
            healthArray.push($(this).data("value"));
        } else if ($(this).prop("checked", false)) {
            var x = healthArray.indexOf($(this).data("value"));
            healthArray.splice(x, 1);
        };
    })






})    