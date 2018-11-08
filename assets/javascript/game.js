// $(document).ready(function () {

    // Initialize characters
    var character = {
        id: ["rey", "luke", "vader", "kylo"],
        name: ["Rey", "Luke Skywalker", "Darth Vader", "Kylo Ren"],
        hp: [100, 120, 140, 160],
        atk: [160, 140, 120, 100],
        ctak: [100, 100, 100, 100]
    }

    var mainChar = "";
    var enemyList = ["", "", ""];

    var winHeight = ($(window).height()-450)/2 + $(window).scrollTop();
    var winWidth = ($(window).width()-300)/2 + $(window).scrollLeft();

    // Display characters
    var mainScreen = $(".container");

    for (var i=0; i<character.id.length; i++) {
        // Put the element at the center of screen
        var char = $("<div class='character'>").attr("id", character.id[i]).css({
            top: winHeight,
            left: (winWidth + i * 300 - 450)
        });

        var pic = $("<img>").attr({
            alt: character.name[i],
            id: character.id[i]+"Pic",
            src: "./assets/images/" + character.id[i] + ".jpg",
            class: "charPic"
        });
        var nameBox = $("<div class='overlay'>").attr("id", character.id[i]+"Name");
        var nameText = $("<div class='charName'>").text(character.name[i]);

        $(nameBox).append(nameText);

        $(char).append(pic);
        $(char).append(nameBox);

        $(mainScreen).append(char);
    }

    // Select main character
    $(".charPic").on("click", function() {
        mainChar = $(this).attr("id");
        selectedMainChar(mainChar.substring(0, mainChar.length - 3));
      });

    // After selected main character
    function selectedMainChar(m) {
        var y = 0;
        for (var i=0; i<4; i++) {
            if (m === character.id[i]) {
                $("#" + m + "Name").css("height", "50px");
                $("#" + m + "Pic").css({"-webkit-filter" : "grayscale(0)", filter: "grayscale(0)"});
                $("#" + m).animate({"left" : (winWidth - 450)},800);  
            } else {
                $("#" + character.id[i]).animate({width: 200, top: (winHeight+75), left: (winWidth + y++ * 200 + 100)});
            }
        }

    };

// }