$(document).ready(function () {


    var apikey = "601bc82ee545b6f36182813802f81761";
    var app_id = "d008515b";
    var queryUrl = "https://api.edamam.com/api/nutrition-details?app_id=" + app_id + "&app_key=" + apikey;
    var offset1 = 0;
    var offset2 = 10;
    var displayed = false;
    var healthArray = [];
    var queryID;
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
        queryID = $(this).attr("data-id");
        var secondaryURL = "https://api.edamam.com/search?q=" + queryID + "&app_id=cae126c9&app_key=c5ce740a41e85392d651319a8ae31a99&diet=balanced";
        $.ajax({
            url: secondaryURL,
            method: "get"
        }).then(function (response) {
            console.log(response)
            var directionsURL = response.hits[0].recipe.url;
            var ingredients = response.hits[0].recipe.ingredients;
            var totalDaily = response.hits[0].recipe.totalDaily;
            var totalNutrients = response.hits[0].recipe.totalNutrients;
            ingredientBreakout(ingredients);
            nutritionBreakout(totalDaily, totalNutrients);

        })
    })

    function ingredientBreakout(ingredients) {
        var ingredientDiv = $("<div>")
            ingredientDiv.append("<h2>Ingredients</h2>")
            ingredientDiv.addClass("col-md-5 text-left")
        for (var j = 0; j<ingredients.length; j++){
            var ingredientLine = $("<p>")
            ingredientLine.text(ingredients[j].text);
            ingredientDiv.append(ingredientLine);
        }
        $("#recipeDetails").append(ingredientDiv);
    };

    function nutritionBreakout (totalDaily, totalNutrients){
        var nutritionTable = $("<table>")
        nutritionTable.addClass("float-right col-md-5")
        var tableHeader = $("<tr><th>Name</th><th>Quantity</th><th>Percentile</th></tr>")
        nutritionTable.append(tableHeader);
        var rowKcal = $("<tr>")
        var kcalNutrient = Math.floor(totalNutrients.ENERC_KCAL.quantity)
        var kcalDaily = Math.floor(totalDaily.ENERC_KCAL.quantity)
        var kcalContents = $(`<td>${totalNutrients.ENERC_KCAL.label}</td><td>${kcalNutrient}${totalNutrients.ENERC_KCAL.unit}</td><td>${kcalDaily}${totalDaily.ENERC_KCAL.unit}</td>`)
        rowKcal.append(kcalContents);
        nutritionTable.append(rowKcal);
        var rowChole = $("<tr>")
        var choleNutrient = Math.floor(totalNutrients.CHOLE.quantity);
        var choleDaily = Math.floor(totalDaily.CHOLE.quantity);
        var choleContents = $(`<td>${totalNutrients.CHOLE.label}</td><td>${choleNutrient}${totalNutrients.CHOLE.unit}</td><td>${choleDaily}${totalDaily.CHOLE.unit}</td>`)
        rowChole.append(choleContents);
        nutritionTable.append(rowChole);
        var rowCarbs = $("<tr>")
        var carbsNutrient = Math.floor(totalNutrients.CHOCDF.quantity);
        var carbsDaily = Math.floor(totalDaily.CHOCDF.quantity);
        var carbsContent = $(`<td>${totalNutrients.CHOCDF.label}</td><td>${carbsNutrient}${totalNutrients.CHOCDF.unit}</td><td>${carbsDaily}${totalDaily.CHOCDF.unit}</td>`)
        rowCarbs.append(carbsContent);
        nutritionTable.append(rowCarbs);
        var rowFat = $("<tr>");
        var fatNutrient = Math.floor(totalNutrients.FAT.quantity);
        var fatDaily = Math.floor(totalDaily.FAT.quantity);
        var fatContent = $(`<td>${totalNutrients.FAT.label}</td><td>${fatNutrient}${totalNutrients.FAT.unit}</td><td>${fatDaily}${totalDaily.FAT.unit}</td>`)
        rowFat.append(fatContent);
        nutritionTable.append(rowFat);
        var rowSodium = $("<tr>");
        var sodiumNutrient = Math.floor(totalNutrients.NA.quantity);
        var sodiumDaily = Math.floor(totalDaily.NA.quantity);
        var sodiumContent = $(`<td>${totalNutrients.NA.label}</td><td>${sodiumNutrient}${totalNutrients.NA.unit}</td><td>${sodiumDaily}${totalDaily.NA.unit}</td>`)
        rowSodium.append(sodiumContent);
        nutritionTable.append(rowSodium);
        var rowProtein = $("<tr>");
        var proteinNutrient = Math.floor(totalNutrients.PROCNT.quantity);
        var proteinDaily = Math.floor(totalDaily.PROCNT.quantity);
        var proteinContent = $(`<td>${totalNutrients.PROCNT.label}</td><td>${proteinNutrient}${totalNutrients.PROCNT.unit}</td><td>${proteinDaily}${totalDaily.PROCNT.unit}</td>`)
        rowProtein.append(proteinContent);
        nutritionTable.append(rowProtein)
        $("#recipeDetails").append(nutritionTable);
    }
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