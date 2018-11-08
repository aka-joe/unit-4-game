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

var winHeight = ($(window).height() - 450) / 2 + $(window).scrollTop();
var winWidth = ($(window).width() - 300) / 2 + $(window).scrollLeft();

var gameStatus = "ready";

// Display characters
var mainScreen = $(".container");

for (var i = 0; i < character.id.length; i++) {
    // Put the element at the center of screen
    var char = $("<div class='character'>").attr("id", character.id[i]).css({
        top: winHeight,
        left: (winWidth + i * 300 - 450)
    });

    var pic = $("<img>").attr({
        alt: character.name[i],
        id: character.id[i] + "Pic",
        src: "./assets/images/" + character.id[i] + ".jpg",
        class: "charPic"
    });
    var nameBox = $("<div class='overlay'>").attr("id", character.id[i] + "Name");
    var nameText = $("<div class='charName'>").text(character.name[i]);

    $(nameBox).append(nameText);

    $(char).append(pic);
    $(char).append(nameBox);

    $(mainScreen).append(char);
}

// Select characters
$(".charPic").on("click", function () {
    if (gameStatus === "ready") {
        var selection = $(this).attr("id");
        selection = selection.substring(0, selection.length - 3)

        if (mainChar === "") {
            mainChar = selection;
            selectedMainChar(selection);
        } else if (mainChar != selection && enemyList[0] === "") {
            enemyList[0] = selection;
            firstEnemy(selection);
        } else if (mainChar != selection && enemyList[0] != selection) {
            enemyList[1] = selection;
            secondEnemy(selection);
        }
    }
});

// Selected main character
function selectedMainChar(m) {
    var x = 0;
    for (var i = 0; i < 4; i++) {
        if (m === character.id[i]) {
            $("#" + m + "Name").css("height", "50px");
            $("#" + m + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
            $("#" + m).animate({ left: (winWidth - 300) }, 800);
        } else {
            $("#" + character.id[i]).animate({ width: 200, top: (winHeight + 75), left: (winWidth + x++ * 200 + 100) });
        }
    }
};

// Selected 1st enemy
function firstEnemy(e1) {
    var y = 0;
    for (var i = 0; i < 4; i++) {
        if (e1 === character.id[i]) {
            $("#" + e1 + "Name").css("height", "50px");
            $("#" + e1 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
            $("#" + e1).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, 800);
        } else if (mainChar != character.id[i]) {
            $("#" + character.id[i]).animate({ width: 150, top: (winHeight + y++ * 225), left: (winWidth + 550) });
        }
    }
};

// Selected 2nd enemy
function secondEnemy(e2) {
    // Find last enemy
    for (var i = 0; i < 4; i++) {
        var e3 = character.id[i];
        if (e3 != mainChar && e3 != enemyList[0] && e3 != e2) {
            enemyList[2] = e3;
            i = 4;
        }
    }
    $("#" + e2 + "Name").css("height", "50px");
    $("#" + e2 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
    $("#" + e2).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, 800);

    $("#" + e3).animate({ width: 150, top: (winHeight), left: (winWidth + 550) });
    $("#" + enemyList[0]).animate({ width: 150, top: (winHeight + 225), left: (winWidth + 550) });

    gameStatus = "fight";
};

// }