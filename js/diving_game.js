/////////////////////////////////////////////////////////////////
///////////////	Global Variables  //////////////////////////////
///////////////////////////////////////////////////////////////

var __game = new Game(800,600,"Diving game");
var __keyboard, __space;
var __player;
var __playerYVel;
var __background;
var __backgroundslide1;
var __backgroundslide2;
var __obstacle;
var __fastObstacle;
var __score;
var __coinText;
var __latestObstacle;
var __coin;
var __latestCoin;
var __coinsCollected;
var __gameOver;
var __coinSymbol;

var pauseText;
var paused = false;

//////////////////////////////////////////////////////////////////
///////////////	Functions ///////////////////////////////////////
////////////////////////////////////////////////////////////////

function preload() {
	keyboard = new Keyboard();
	left = keyboard.createLeftKey();
	right = keyboard.createRightKey();
	space = keyboard.createSpaceKey();
	
	preloadJetpack();
}

function create() {
	createJetpack();
}


function update() {
	updateJetpack();
}

////////////////////////
// Jetpack minigame ///
//////////////////////

function preloadJetpack() {
	__player = new Sprite("img/underwater-jetpack-player.png",18,28);
	__coin = new Sprite("img/Bottle-2.0.png",148,150);
	__obstacle = new Sprite("img/Eel-2.0.png",616,418);
	__fastObstacle = new Sprite("img/Sharks-2.0.png",190,82);
	__gameOver = new Sprite("img/gameover1.png",520,99);
	__coinSymbol = new Sprite("img/Bottle-2.0.png",148,150)

	__score = 0;
	__coinsCollected = 0;
	
	__game.loadBackgroundImage("bg1","img/Underwater-background.jpg");
	
}

function createJetpack() {
	
	__game.setBackgroundImage("bg1");
	
	__currentPlayer = __player.create(50,54,34,54);
	__playerYVel = 0;
	__player.addAnimation('up', [0,1], 5);
	__player.addAnimation('down', [0,1], 5);
	__player.setAngle(65);
	
	
	
	__latestCoin = __coin.create(800,Math.floor(Math.random()*601),20,40);
	__latestCoin.setVelocityX(-200 - (__score/25));

	
	__coinText = new Text("0",55,8,"50px","Arial","#FFFFFF");
	__coinSymbol.create(15,10,25,50);

	pauseText = new Text("Press 'P' to pause game.", (__game.gameWidth()/2)- 100, 10, "20px", "Gaegu", "#ffffff");
}

function updateJetpack() {
	__game.scrollBackgroundX(-2);		
	__game.checkOverlap(__currentPlayer, __obstacle, __hitObstacle);
	__game.checkOverlap(__currentPlayer, __fastObstacle, __hitObstacle);
	__game.checkOverlap(__currentPlayer, __coin, __collectedCoin, [__currentPlayer, __coin]);
	
	__score = __score + 1;
	
	__coinText.changeText(__coinsCollected);

	if(space.isDown()) { //checks for space key pressed
		if (__playerYVel < 200) {
			__playerYVel = __playerYVel + 10;
		}
		__player.playAnimation('up');
	} else {
		__player.playAnimation('down');
	}

	if((__currentPlayer.getY() > 550) && (__playerYVel>0)){ //collision sensing with world edge
		__currentPlayer.setY(550)
		__playerYVel = 0;
	}
	else if ((__currentPlayer.getY() < 0) && (__playerYVel<0)){
	 	__currentPlayer.setY(0);
		__playerYVel = 0;
	}
	else {
		if ((__playerYVel > -200) && (__currentPlayer.getY() > 0)) {
			__playerYVel = __playerYVel - 5; // gravity
		}		
	}
	
	__currentPlayer.setVelocityY(__playerYVel);
	
	
	if ( __score % 50 == 0) {  //create obstacle
		__latestObstacle = __obstacle.create(800,Math.floor(Math.random()*601),93,63);
		__latestObstacle.setVelocityX(-200 - (__score/25));  // gets faster as game progresses
		__latestObstacle.child.anchor.setTo(0.5,0.5);
	}
	
	if( __score % 37 == 0) { //create coin
		__latestCoin = __coin.create(800,Math.floor(Math.random()*601),20,40);
		__latestCoin.setVelocityX(-200 - (__score/25));

	}
		
	if (__score % 180 == 0) { //creates fast obstacle
		__latestObstacle = __fastObstacle.create(800,Math.floor(Math.random()*601),164,85);
		__latestObstacle.setVelocityX(-300 - (__score/25));  // gets faster as game progresses
		__latestObstacle.addAnimation('shark',[0,1,2,3,4,5,6,7,8,9],5);
		__latestObstacle.playAnimation('shark');
		//__latestObstacle.child.anchor.setTo(0.5,0.5);
		//__latestObstacle.setAngle(45);
	}

}

function __hitObstacle(__thePlayer, __obstacleToKill) { //when you hit an obstacle game over

	__thePlayer.kill();
	__gameOver.create(75,225,650,124);
	
	handleLeaderboards();

	$("#jp").trigger("click");
	$("#diverdodger").trigger("click");
	setTimeout(function() {
		__gameOver.setAlpha(0);
		$(".tutorial-container").fadeIn(1000);
		setTimeout(function() {
			window.location.href = 'map.html';
		}, 5000);
	}, 2500);
}

function __collectedCoin(__thePlayer, __coinToKill) {
	__coinToKill.kill();
	__coinsCollected += 1;
}

var gm = 1;
var levelName = "Diver Dodger";

function handleLeaderboards() {
	var leaderboards = JSON.parse(localStorage.getItem("leaderboards"));
	if (leaderboards == null) {
		leaderboards = {};
	}
	var leaderboard = leaderboards[gm];
	if (leaderboard == null) {
		leaderboard = {};
		leaderboards[gm] = leaderboard;
	}
	var levelScores = leaderboard[levelName];
	if (levelScores == null) {
		levelScores = [];
	}
	levelScores.push(String(__coinsCollected));
	leaderboards[gm][levelName] = levelScores;
	localStorage.setItem("leaderboards", JSON.stringify(leaderboards));
}

function resume() {
	__game.resume();
	paused = false;
	$(".menu-container").hide();
}

function pause() {
	__game.pause();
	paused = true;
	$(".menu-container").show();
}

$(document).ready(function() {
	$("#back_arrow").hide();
	$(".tutorial-container").hide();
	$(".tutorial-container").css("position", "absolute");
	$(".tutorial-container").css("left", "0");
	$(".tutorial-container").css("right", "0");
	$(".tutorial-container").css("margin", "auto");
	$(".tutorial-header h1").css("opacity", "0.5");
	$(".menu-container").hide();
	$(".menu-container").css("position", "absolute");
	$(".menu-container").css("left", "0");
	$(".menu-container").css("right", "0");
	$(".menu-container").css("margin", "auto");
	$(".center-menu").css("background-image", "none");
	$(document).keydown(function(e) {
		if (e.which == 80) { 
			if (paused) {
				resume();
			} else {
				pause();
			}
		}
	});
	$("#resume").click(function() {
		resume();
	});
});