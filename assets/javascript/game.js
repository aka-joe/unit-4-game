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
        var char = $("<div class='character'>");
        var pic = $("<img>").attr({
            alt: character.name[i],
            src: "./assets/images/" + character.id[i] + ".jpg",
            class: "charPic"
        });
        var nameBox = $("<div class='overlay'>").attr("id", character.id[i]);
        var nameText = $("<div class='charName'>").text(character.name[i]);

        $(nameBox).append(nameText);

        $(char).append(pic);
        $(char).append(nameBox);

        $(mainScreen).append(char);
    }
    
// }