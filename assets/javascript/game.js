// $(document).ready(function () {

    // Initialize characters
    var character = {
        id: ["rey", "luke", "vader", "kylo"],
        name: ["Rey", "Luke Skywalker", "Darth Vader", "Kylo Ren"],
        hp: [100, 120, 140, 160],
        atk: [160, 140, 120, 100],
        ctak: [100, 100, 100, 100]
    }

    // Display characters
    var mainScreen = $(".container");

    for (var i=0; i<character.id.length; i++) {
        // Put the element at the center of screen
        var char = $("<div class='character'>").attr("id", character.id[i]).css({
            "top" : Math.max(0, (($(window).height()-450)/2) + $(window).scrollTop()) +"px",
            "left" : Math.max(0, (($(window).width()-300)/2) + $(window).scrollLeft()+i*300-450)  +"px"
        });

        var pic = $("<img>").attr({
            alt: character.name[i],
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

    $(".character").on("click", function() {
        $(this).animate({'width': '150px'},'slow');
      });

// }