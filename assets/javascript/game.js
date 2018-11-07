$(document).ready(function () {

    var character = {
        id: ["rey", "luke", "vader", "kylo"],
        name: ["Rey", "Luke Skywalker", "Darth Vader", "Kylo Ren"],
        hp: [100, 120, 140, 160],
        atk: [160, 140, 120, 100],
        ctak: [100, 100, 100, 100]
    }

    var mainScreen = $(".container");
    for (var i=0; i<character.id.length; i++) {
        var char = $(".character");
        $(char).append("<img>")
    }
}