$(document).ready(function () {

    // Initialize characters
    var character = {
        id: ["Cloud", "Squall", "Lightning", "Noctis"],
        hp: [140, 160, 180, 200],
        atk: [31, 24, 17, 10],
        ct: [15, 25, 35, 45],
        clr: ["rgba(63, 168, 230, 0.7)", "rgba(17, 153, 46, 0.6)", "rgba(199, 60, 136, 0.7)", "rgba(56, 56, 56, 0.7)"]
    }

    var mainChar = "";
    var enemyList = ["", "", ""];
    var attacker = 0;
    var defender = 0;

    var winHeight = ($(window).height() - 450) / 2 + $(window).scrollTop();
    var winWidth = ($(window).width() - 300) / 2 + $(window).scrollLeft();
    var aniSpeed = 600;
    var clicked = false;

    // Game status
    // 0 - Waiting to start the game
    // 1 - Selecting main character and 1st opponent
    // 2 - 1st fighting
    // 3 - Selecting 2nd opponent
    // 4 - 2nd fighting
    // 5 - Auto selecting last opponent
    // 6 - Last fighting
    // 7 - User win
    // 8 - User lose
    var gameStatus = 0;

    // Display logo and footer
    $("#logo").css({ top: winHeight - 250, left: winWidth - 150 });
    $("#ff").css({ top: winHeight + 180, left: winWidth - 200 });
    $("footer").css("right", winWidth + 40);

    // Create characters
    var mainScreen = $(".container");

    for (var i = 0; i < character.id.length; i++) {
        // Put the element at the center of screen
        var char = $("<div class='character'>").attr("id", character.id[i]).css({
            top: winHeight,
            left: (winWidth + i * 300 - 450),
            cursor: "pointer"
        });

        var pic = $("<img>").attr({
            alt: character.id[i],
            id: character.id[i] + "Pic",
            src: "./assets/images/" + character.id[i] + ".png",
            class: "charPic",
            hp: character.hp[i],
            atk: character.atk[i],
            ct: character.ct[i],
        });

        var nameBox = $("<div class='overlay'>").attr("id", character.id[i] + "Tag").css("background-color", character.clr[i]);
        var nameText = $("<div class='charName'>").text(character.id[i]).attr("id", character.id[i] + "Name");

        nameBox.append(nameText);
        char.append(pic);
        char.append(nameBox);
        mainScreen.append(char);
        char.hide();
    }

    // Create button and message boxes
    var atkBtn = $("<button>").text("ATTACK").attr("id", "attack");
    atkBtn.css({ position: "absolute", top: winHeight + 470, left: winWidth - 200 });
    mainScreen.append(atkBtn);
    atkBtn.hide();

    var notice = $("<div>").attr("id", "notice");
    mainScreen.append(notice);
    notice.hide();

    var message = $("<div>").text("CLICK HERE TO START THE GAME").attr("id", "message");
    message.css({ position: "absolute", top: winHeight + 400, left: winWidth - 100 });
    mainScreen.append(message);

    var vs = $("<img>").attr({
        alt: "VS",
        id: "vsSign",
        src: "./assets/images/vs.png"
    });
    vs.css({ position: "absolute", top: winHeight + 185, left: winWidth + 80 });
    mainScreen.append(vs);
    vs.hide();

    // Start game button
    $("#message").on("click", function () {
        if (gameStatus === 0) {
            resetGame();
            notice.hide();
            message.hide();
            $("#logo").animate({ top: 0, left: 160, width: 165, height: 200 }, aniSpeed);
            $("#ff").animate({ top: 80, left: 100, width: 350, height: 67 }, aniSpeed);
            $("footer").animate({ right: 50 }, aniSpeed);
            message.css({ "font-size": 40, top: winHeight + 500, left: winWidth - 100 });
            message.text("SELECT YOUR CHARACTER").css("cursor", "default");
            message.fadeIn(aniSpeed * 3);
            for (var i = 0; i < character.id.length; i++) {
                $("#" + character.id[i]).delay(i * 300).fadeIn(aniSpeed);
            }
        }
    });

    // Select characters
    $(".charPic").on("click", function () {
        var selection = $(this).attr("id");
        selection = selection.substring(0, selection.length - 3)

        if (gameStatus === 1) {
            if (mainChar === "") {
                mainChar = selection;
                selectedMainChar(selection);
            } else if (mainChar != selection && enemyList[0] === "") {
                enemyList[0] = selection;
                firstEnemy(selection);
            }
        } else if (gameStatus === 3 && mainChar != selection && enemyList[0] != selection) {
            enemyList[1] = selection;
            secondEnemy(selection);
        };
    });

    // Selected main character
    function selectedMainChar(m) {
        message.hide();
        var x = 0;
        for (var i = 0; i < 4; i++) {
            if (m === character.id[i]) {
                attacker = i;
                base_atk = character.atk[i];
                $("#attack").css("background-color", character.clr[i]);
                $("#" + m + "Tag").css("height", "50px");
                $("#" + m + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
                $("#" + m).css("cursor", "default").delay(0).animate({ left: (winWidth - 300) }, aniSpeed);
                $("#" + m + "Name").text("Attacker");
            } else {
                $("#" + character.id[i]).delay(0).animate({ width: 200, top: (winHeight + 30), left: (winWidth + x++ * 200 + 100) }, aniSpeed);
            }
        }
        message.text("SELECT YOUR OPPONENT").css({ "font-size": 30, top: (winHeight + 380), left: (winWidth + 230) });
        message.fadeIn(aniSpeed);
    };

    // Selected 1st enemy
    function firstEnemy(e1) {
        message.fadeOut();
        var y = 0;
        for (var i = 0; i < 4; i++) {
            if (e1 === character.id[i]) {
                defender = i;
                $("#" + e1 + "Tag").css("height", "50px");
                $("#" + e1 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
                $("#" + e1).css("cursor", "default").delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
                $("#" + e1 + "Name").text("Defender");
            } else if (mainChar != character.id[i]) {
                $("#" + character.id[i]).delay(0).animate({ width: 150, top: (winHeight + y++ * 225), left: (winWidth + 550) }, aniSpeed);
            }
        }
        fighting();
    };

    // Selected 2nd enemy
    function secondEnemy(e2) {
        message.fadeOut();
        var e1 = enemyList[0];

        defender = $.inArray(e2, character.id);
        $("#" + e2 + "Tag").css("height", "50px");
        $("#" + e2 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
        $("#" + e2).css("cursor", "default").delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
        $("#" + e2 + "Name").text("Defender");

        // Find last enemy
        for (var i = 0; i < 4; i++) {
            var e3 = character.id[i];
            if (e3 != mainChar && e3 != enemyList[0] && e3 != e2) {
                enemyList[2] = e3;
                i = 4;
            }
        }
        $("#" + e3).css("cursor", "default").delay(0).animate({ width: 150, top: (winHeight), left: (winWidth + 550) }, aniSpeed);
        $("#" + e1).delay(0).animate({ width: 150, top: (winHeight + 225), left: (winWidth + 550) }, aniSpeed);

        fighting();
    };

    // 3rd enemy
    function thirdEnemy() {
        var e2 = enemyList[1];
        var e3 = enemyList[2];

        defender = $.inArray(e3, character.id);
        $("#" + e3 + "Tag").css("height", "50px");
        $("#" + e3 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
        $("#" + e3).delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
        $("#" + e3 + "Name").text("Defender");

        $("#" + e2).delay(0).animate({ width: 150, top: (winHeight), left: (winWidth + 550) }, aniSpeed);
        defeated(e2);

        fighting();
    };

    // Defeated
    function defeated(d) {
        atkBtn.fadeOut();
        vs.fadeOut();
        $("#" + d + "Pic").css({
            "-webkit-filter": "grayscale(100%) brightness(40%) blur(2px)",
            filter: "grayscale(100%) brightness(40%) blur(2px)"
        });
        $("#" + d + "Tag").css({ width: "100%", height: "100%", "background-color": "rgba(150, 0, 0, 0.15)" });
        $("#" + d + "Name").text("Defeated");

        if (gameStatus === 7) {
            gameOver(true);
        } else if (gameStatus === 8) {
            gameOver(false);
        }
    };

    // Fighting mode
    function fighting() {
        gameStatus++;
        atkBtn.fadeIn(aniSpeed);
        vs.fadeIn(aniSpeed * 2);
    };

    // Game Over
    function gameOver(userWin) {
        $(".overlay").css("height", "0");
        notice.css({
            "font-size": 100,
            "font-family": "'Audiowide', cursive",
            "color": "#ee0000",
            "text-shadow": "0 0 10px black",
            top: winHeight + 180
        });

        if (userWin) {
            notice.text("You won!");
            notice.css("left", winWidth + 120);
        } else {
            notice.text("You lost...");
            notice.css("left", winWidth - 330);
        }

        message.text("CLICK HERE TO PLAY AGAIN").css("cursor", "pointer");
        message.css({ "font-size": 30, top: (winHeight + 500), left: (winWidth - 50) });
        message.fadeIn(aniSpeed);
        notice.delay(aniSpeed).fadeIn(aniSpeed);
        gameStatus = 0;
    };

    // Restart the game
    function resetGame() {
        mainChar = "";
        enemyList = ["", "", ""];
        winHeight = ($(window).height() - 450) / 2 + $(window).scrollTop();
        winWidth = ($(window).width() - 300) / 2 + $(window).scrollLeft();
        clicked = false;
        atkBtn.css({ top: winHeight + 470, left: winWidth - 200 });
        vs.css({ top: winHeight + 185, left: winWidth + 80 });
        gameStatus = 1;
        for (var i = 0; i < character.id.length; i++) {
            var c = character.id[i];
            character.hp[i] = Number($("#" + c + "Pic").attr("hp"));
            character.atk[i] = Number($("#" + c + "Pic").attr("atk"));
            character.ct[i] = Number($("#" + c + "Pic").attr("ct"));
            $("#" + c).css({ "cursor": "pointer", width: "", top: winHeight, left: (winWidth + i * 300 - 450) });
            $("#" + c + "Tag").css({ width: "", height: "", "background-color": character.clr[i] });
            $("#" + c + "Pic").css({ "-webkit-filter": "", filter: "" });
            $("#" + c + "Name").text(c);
            $("#" + c).hide();
        }
    };

    // Attack button pressed
    atkBtn.on("click", function () {
        if (!clicked){
            var a = character.id[attacker];
            var a_hp = character.hp[attacker];
            var a_pow = character.atk[attacker];
            var d = character.id[defender];
            var d_hp = character.hp[defender];
            var d_pow = character.ct[defender];

            d_hp -= a_pow;
            a_pow += Number($("#" + a + "Pic").attr("atk"));

            $("#" + d + "Tag").css("width", (d_hp / Number($("#" + d + "Pic").attr("hp"))*100) +"%" );
            $("#" + d + "Name").text("HP " + d_hp);

            if (d_hp > 0) {         // Game status
                a_hp -= d_pow;      // 0 - Waiting to start the game
            } else {                // 1 - Selecting main character and 1st opponent
                gameStatus++;       // 2 - 1st fighting
                defeated(d);        // 3 - Selecting 2nd opponent
            }                       // 4 - 2nd fighting
            if (a_hp <= 0) {        // 5 - Auto selecting last opponent
                gameStatus = 8;     // 6 - Last fighting
                defeated(a);        // 7 - User win
            }                       // 8 - User lose

            $("#" + a + "Tag").css("width", (a_hp / Number($("#" + a + "Pic").attr("hp"))*100) +"%" );
            $("#" + a + "Name").text("HP " + a_hp);

            character.hp[attacker] = a_hp;
            character.atk[attacker] = a_pow;
            character.hp[defender] = d_hp;
            character.ct[defender] = d_pow;

            if (gameStatus === 3) {
                message.text("SELECT YOUR NEXT OPPONENT");
                message.css({ "font-size": 24, top: (winHeight + 480), left: (winWidth + 310) });
                message.fadeIn(aniSpeed);
            } else if (gameStatus === 5) {
                thirdEnemy();
            };

            // Prevent fast-clicking-bug
            clicked = true;
            setTimeout(function(){ clicked = false; }, 500); 
        };
    });
});