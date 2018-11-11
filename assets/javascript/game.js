$(document).ready(function () {

    // Initialize music and sounds
    var openingMusic = document.createElement('audio');
    var selectSound = document.createElement('audio');
    var acceptSound = document.createElement('audio');
    var completSound = document.createElement('audio');
    var hitSound = document.createElement('audio');
    var battleMusic = document.createElement('audio');
    var wonMusic = document.createElement('audio');
    var lostMusic = document.createElement('audio');

    openingMusic.setAttribute('src', './assets/sounds/FFI-OpeningTheme.mp3');
    selectSound.setAttribute('src', './assets/sounds/select.mp3');
    acceptSound.setAttribute('src', './assets/sounds/accept.mp3');
    completSound.setAttribute('src', './assets/sounds/complete.mp3');
    hitSound.setAttribute('src', './assets/sounds/hit.mp3');
    battleMusic.setAttribute('src', './assets/sounds/FFVIII-BattleTheme.mp3')
    wonMusic.setAttribute('src', './assets/sounds/FFXIV-VictoryFanfare.mp3');
    lostMusic.setAttribute('src', './assets/sounds/FFX-GameOver.mp3');
    
    // Loop BGM
    openingMusic.addEventListener('ended', function() {
        this.play();
    }, false);
    openingMusic.play();
    battleMusic.addEventListener('ended', function() {
        this.play();
    }, false);

    // Initialize characters
    var character = {
        id: ["Cloud", "Squall", "Lightning", "Noctis"],
        hp: [140, 160, 180, 200],
        atk: [31, 24, 17, 10],
        ct: [15, 25, 35, 45],
        clr: ["rgba(63, 168, 230, 0.7)", "rgba(17, 153, 46, 0.6)", "rgba(199, 60, 136, 0.7)", "rgba(56, 56, 56, 0.7)"]
    }

    // Create variables for attacker and defenders
    var mainChar = "";
    var enemyList = ["", "", ""];
    var attacker = 0;
    var defender = 0;

    // Set game config
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

        // Put pictures and store the characters' stats
        var pic = $("<img>").attr({
            alt: character.id[i],
            id: character.id[i] + "Pic",
            src: "./assets/images/" + character.id[i] + ".png",
            class: "charPic",
            hp: character.hp[i],
            atk: character.atk[i],
            ct: character.ct[i]
        });

        // Create the chracters' name tags
        var nameBox = $("<div class='overlay'>").attr("id", character.id[i] + "Tag").css("background-color", character.clr[i]);
        var nameText = $("<div class='charName'>").text(character.id[i]).attr("id", character.id[i] + "Name");

        nameBox.append(nameText);
        char.append(pic);
        char.append(nameBox);
        mainScreen.append(char);
        char.hide();
    }

    // Create and hide 'Attack button'
    var atkBtn = $("<button>").text("ATTACK").attr("id", "attack");
    atkBtn.css({ position: "absolute", top: winHeight + 470, left: winWidth - 200 });
    mainScreen.append(atkBtn);
    atkBtn.hide();

    // Create and hide damage dealt status
    var damage = $("<div>").attr("id", "damage");
    damage.text("Testing");
    damage.css({ top: winHeight + 320, left: winWidth + 5 });
    mainScreen.append(damage);
    damage.hide();

    // Create and hide the 1st message box
    var notice = $("<div>").attr("id", "notice");
    mainScreen.append(notice);
    notice.hide();

    // Create and hide the 2nd message box
    var message = $("<div>").text("CLICK HERE TO START THE GAME").attr("id", "message");
    message.css({ position: "absolute", top: winHeight + 400, left: winWidth - 100 });
    mainScreen.append(message);

    // Create and hide 'VS' sign
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
            acceptSound.play();
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

    // Sound for selecting characters
    $(".charPic").mouseover(function () {
        if (($(this).attr("id") != mainChar+"Pic") && (gameStatus === 1 || gameStatus === 3 || gameStatus === 5)) {
            selectSound.currentTime = 0;
            selectSound.play();
        };
    });

    // Selected main character
    function selectedMainChar(m) {
        message.hide();
        var x = 0;
        for (var i = 0; i < 4; i++) {
            if (m === character.id[i]) {
                // Move the player's character to 'Attacker' position
                completSound.currentTime = 0;
                completSound.play();
                attacker = i;
                $("#attack").css("background-color", character.clr[i]);
                $("#" + m + "Tag").css("height", "50px");
                $("#" + m + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
                $("#" + m).css("cursor", "default").delay(0).animate({ left: (winWidth - 300) }, aniSpeed);
                $("#" + m + "Name").text("Attacker");
            } else {
                // Shrink and move other characters
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
                // Move the 1st opponent to 'Defender' position
                openingMusic.pause();
                completSound.currentTime = 0;
                completSound.play();
                battleMusic.currentTime = 0;
                battleMusic.play();
                defender = i;
                $("#" + e1 + "Tag").css("height", "50px");
                $("#" + e1 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
                $("#" + e1).css("cursor", "default").delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
                $("#" + e1 + "Name").text("Defender");
            } else if (mainChar != character.id[i]) {
                // Move other opponents to back
                $("#" + character.id[i]).delay(0).animate({ width: 150, top: (winHeight + y++ * 225), left: (winWidth + 550) }, aniSpeed);
            }
        }
        fighting();
    };

    // Selected 2nd enemy
    function secondEnemy(e2) {
        message.fadeOut();
        var e1 = enemyList[0];

        // Set the 2nd opponent's 'Defender' position
        defender = $.inArray(e2, character.id);
        completSound.currentTime = 0;
        completSound.play();
        $("#" + e2 + "Tag").css("height", "50px");
        $("#" + e2 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
        $("#" + e2).css("cursor", "default").delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
        $("#" + e2 + "Name").text("Defender");

        // Find last opponent
        for (var i = 0; i < 4; i++) {
            var e3 = character.id[i];
            if (e3 != mainChar && e3 != enemyList[0] && e3 != e2) {
                enemyList[2] = e3;
                i = 4;
            }
        }

        // Move opponents
        $("#" + e3).css("cursor", "default").delay(0).animate({ width: 150, top: (winHeight), left: (winWidth + 550) }, aniSpeed);
        $("#" + e1).delay(0).animate({ width: 150, top: (winHeight + 225), left: (winWidth + 550) }, aniSpeed);

        fighting();
    };

    // Auto selecting 3rd enemy
    function thirdEnemy() {
        var e2 = enemyList[1];
        var e3 = enemyList[2];

        // Move last opponent to 'Defender' position
        defender = $.inArray(e3, character.id);
        $("#" + e3 + "Tag").css("height", "50px");
        $("#" + e3 + "Pic").css({ "-webkit-filter": "grayscale(0)", filter: "grayscale(0)" });
        $("#" + e3).delay(0).animate({ width: 300, top: winHeight, left: (winWidth + 250) }, aniSpeed);
        $("#" + e3 + "Name").text("Defender");

        // Remove a defeated opponent from 'Defender' position
        $("#" + e2).delay(0).animate({ width: 150, top: (winHeight), left: (winWidth + 550) }, aniSpeed);
        defeated(e2);

        fighting();
    };

    // Defeated
    function defeated(d) {
        // Hide attack button and 'VS' sign
        atkBtn.fadeOut();
        vs.fadeOut();

        // Show 'Defeated' message
        $("#" + d + "Pic").css({
            "-webkit-filter": "grayscale(100%) brightness(40%) blur(2px)",
            filter: "grayscale(100%) brightness(40%) blur(2px)"
        });
        $("#" + d + "Tag").css({ width: "100%", height: "100%", "background-color": "rgba(150, 0, 0, 0.15)" });
        $("#" + d + "Name").text("Defeated");

        if (gameStatus === 7) {
            gameOver(true);  // Won
        } else if (gameStatus === 8) {
            gameOver(false); // Lost
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
        // Hide and reset the character overlay box
        $(".overlay").css("height", "0");
        notice.css({
            "font-size": 100,
            "font-family": "'Audiowide', cursive",
            "color": "#ee0000",
            "text-shadow": "0 0 10px black",
            top: winHeight + 180
        });
        // Show 'won' or 'lost' message
        if (userWin) {
            notice.text("You won!").css("left", winWidth + 120);
            wonMusic.currentTime = 0;
            wonMusic.play();
        } else {
            notice.text("You lost...").css("left", winWidth - 330);
            lostMusic.currentTime = 0;
            lostMusic.play();

        }
        message.text("CLICK HERE TO PLAY AGAIN").css("cursor", "pointer");
        message.css({ "font-size": 30, top: (winHeight + 500), left: (winWidth - 50) });
        message.fadeIn(aniSpeed);
        notice.delay(aniSpeed).fadeIn(aniSpeed * 2);
        battleMusic.pause();
        openingMusic.currentTime = 0;
        gameStatus = 0;
    };

    // Reset the game
    function resetGame() {
        wonMusic.pause();
        lostMusic.pause();
        openingMusic.play();
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
        if (!clicked) {
            hitSound.currentTime = 0;
            hitSound.play();

            var a = character.id[attacker];
            var a_hp = character.hp[attacker];
            var a_pow = character.atk[attacker];
            var d = character.id[defender];
            var d_hp = character.hp[defender];
            var d_pow = character.ct[defender];
            var dmg = "";

            dmg = "You dealt<br>" + a_pow + " damage<br><br>"
            d_hp -= a_pow;
            a_pow += Number($("#" + a + "Pic").attr("atk"));

            // Display opponent's HP bar
            $("#" + d + "Tag").css("width", (d_hp / Number($("#" + d + "Pic").attr("hp")) * 100) + "%");
            $("#" + d + "Name").text("HP " + d_hp);
            $("#" + d + "Name").text("HP " + d_hp);

            // Check player and opponent characters' status
            if (d_hp > 0) {
                dmg += d + " dealt<br>" + d_pow + " damage<br>"
                a_hp -= d_pow;
            } else {
                dmg += "You defeated<br>" + d + "!";
                gameStatus++;
                defeated(d);
            }
            if (a_hp <= 0) {
                gameStatus = 8;
                defeated(a);
            }

            // Display players's HP bar and dealt damages
            $("#" + a + "Tag").css("width", (a_hp / Number($("#" + a + "Pic").attr("hp")) * 100) + "%");
            $("#" + a + "Name").text("HP " + a_hp);
            damage.html(dmg).show().delay(aniSpeed * 2).fadeOut(aniSpeed);

            // Store the charaters' stats to global variables
            character.hp[attacker] = a_hp;
            character.atk[attacker] = a_pow;
            character.hp[defender] = d_hp;
            character.ct[defender] = d_pow;

            if (gameStatus === 3) {
                // To select 2nd opponent
                message.text("SELECT YOUR NEXT OPPONENT");
                message.css({ "font-size": 24, top: (winHeight + 480), left: (winWidth + 310) });
                message.fadeIn(aniSpeed);
            } else if (gameStatus === 5) {
                // Auto selecting last opponent
                thirdEnemy();
            };

            // Prevent fast-clicking-bug
            clicked = true;
            setTimeout(function () { clicked = false; }, 500);
        };
    });
});