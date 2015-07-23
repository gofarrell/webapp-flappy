// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var labelScore;
var player;
var gapStart = game.rnd.integerInRange(1, 5);
var pipes = [];
var spaceman = [];
var alien = [];
var gameGravity = 200;
/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    jQuery("#greeting-form").on("submit", function(event_details) {
        var greeting = "Thank You ";
        var name = jQuery("#fullName").val();

        // sets score in the form
        jQuery("#score").val(score);

        var greeting_message = greeting + name;
        jQuery("#greeting-form").hide();
        jQuery("#greeting").append("<p>" + greeting_message + "</p>");
        event_details.preventDefault();

        setTimeout(function() {
            location.assign("index.html");
        }, 1300);
    });
    game.load.image("backgroundImg", "../assets/galaxy.jpg");
    game.load.image("playerImg", "../assets/spaceship.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/pipeblock2.png");
    game.load.image("pipehead", "../assets/pipehead.png");
    game.load.image("spaceman", "../assets/spaceman1.png");
    game.load.image("alien", "../assets/alien.png");
    game.load.audio("music", "../assets/music.mp3")

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // alert("Press start")
    // set the background colour of the scene
    play();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 800;
    background.height = 500;
    game.add.text(190, 280, "3, 2, 1, Blast Off!",
        {font: "50px Arial", fill: "#FFFFFF"});
    // game.add.sprite(10,10, "playerImg");
    player = game.add.sprite(50, 200, "playerImg");
    player.scale.x = 0.035;
    player.scale.y = 0.035;
    game.physics.arcade.enable(player);

    player.anchor.setTo(0, 0);
    player.anchor.setTo(1, 1);
    player.anchor.setTo(0.0, 0.0);

    //game.input
    //  .onDown
    //.add(clickHandler);
    labelScore = game.add.text(730, 20, "0",{font: "50px Arial", fill: "#FFFFFF"});
    game.input.keyboard
        .addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
    generate();
    player.body.velocity.x = 0;
    player.body.gravity.y = gameGravity;
    pipeInterval = 2.00;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);
}
function play() {
    game.sound.play("music")
}
function spaceHandler() {
    //game.sound.play("score");
}
//function clickHandler(event) {
// game.add.sprite(event.x, event.y, "playerImg");
//}
function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}
function Pause() {
    game.paused = true;
}

function Restart() {
    game.paused = false;
}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}
function moveRight() {
    player.x += 20;
}
function moveLeft() {
    player.x -= 20;
}
function moveDown() {
    player.y += 20;
}
function generatePipe() {
    var gap = game.rnd.integerInRange(1, 5);
    // if count == 0 add the head of the block
    count = 0;
    addPipeBlockHead(785, count * 50);
    for (var count = 1; count < 9; count = count + 1) {
        if (count != gap && count != gap + 1 && count != gap + 2) {
            addPipeBlock(825, count * 43);
        }

    }
    changeScore();
}
function generate() {
    var diceRoll = game.rnd.integerInRange(1, 5);

    if(diceRoll == 1) {
        generateSpaceman();
    } else if(diceRoll == 2) {
        generateAlien();
    }

    generatePipe();
}

function generateSpaceman() {
    var bonus = game.add.sprite(game.width, game.height, "spaceman");
    spaceman.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200 * Math.random();
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);

}
function generateAlien() {
    var bonus = game.add.sprite(game.width, game.height, "alien");
    alien.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200 * Math.random();
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}
function addPipeBlockHead(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipehead");
    pipeBlock.scale.x = 0.2;
    pipeBlock.scale.y = 0.2;
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipeBlock.scale.x = 0.17;
    pipeBlock.scale.y = 0.5;
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}
function playerJump() {
    player.body.velocity.y = -120
}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {


    if (player == undefined) {
        return;
    }

    for(var i=spaceman.length - 1; i >= 0; i--){
        game.physics.arcade.overlap(player,spaceman[i], function(){

            changeGravity(-75);
            spaceman[i].destroy();
            spaceman.splice(i,1);
        });
    }
    for(var i=alien.length - 1; i >= 0; i--){
        game.physics.arcade.overlap(player,alien[i], function(){

            changeGravity(75);
            alien[i].destroy();
            alien.splice(i,1);
        });
    }

    game.input
        .keyboard.addKey(Phaser.Keyboard.P)
        .onDown.add(Pause);
    game.input
        .keyboard.addKey(Phaser.Keyboard.R)
        .onDown.add(Restart);
    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);
    var score;
    score = 0;

    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y > game.height - player.height) {
        player.y = game.height - player.height;
    }



    player.rotation += 1;
    player.rotation = Math.atan(player.body.velocity.y / 200);


}


function gameOver(){
    game.destroy();
    //set.background()
    $("#score").val(score.toString());
    gameGravity = 200;
}




$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;

    });
    for (var i = 0; i < 3; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});