/////////////////////////////////////////////////////////////////
///////////////	Global Variables  //////////////////////////////
///////////////////////////////////////////////////////////////

var _game = new Game(800,600,"Jetpack game");
var _keyboard, _space;
var _player;
var _playerYVel;
var _background;
var _backgroundslide1;
var _backgroundslide2;
var _obstacle;
var _fastObstacle;
var _score;
var _coinText;
var _latestObstacle;
var _coin;
var _latestCoin;
var _coinsCollected;
var _gameOver;
var _coinSymbol;

var pauseText;
var paused = false;

var gm = 1;
var levelName = "Meteor Mayhem";

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
	_player = new Sprite("img/jetpack-player-transparent.png",17,27);
	_coin = new Sprite("img/coin-rotation.png",128,128);
	_obstacle = new Sprite("img/meteor-3.0.png",70,55);
	_fastObstacle = new Sprite("img/meteor-2.0.png",219,113);
	_gameOver = new Sprite("img/gameover1.png",520,99);
	_coinSymbol = new Sprite("img/coin-rotation.png",128,128)

	_score = 0;
	_coinsCollected = 0;
	
	_game.loadBackgroundImage("bg1","img/space-background2.png");
	
}

function createJetpack() {
	
	_game.setBackgroundImage("bg1");
	
	_currentPlayer = _player.create(50,54,34,54);
	_playerYVel = 0;
	_player.addAnimation('up', [0,1], 5);
	_player.addAnimation('down', [2,3], 5);
	_player.setAngle(10);
	
	
	
	_latestCoin = _coin.create(800,Math.floor(Math.random()*601),25,25);
	_latestCoin.setVelocityX(-200 - (_score/25));
	_coin.addAnimation('rotate', [0,1,2,3,2,1], 10);
	_coin.playAnimation('rotate');
	
	_coinText = new Text("0",70,8,"50px","Arial","#FFFFFF");
	_coinSymbol.create(10,10,50,50);

	pauseText = new Text("Press 'P' to pause game.", (_game.gameWidth()/2)- 100, 10, "20px", "Gaegu", "#ffffff");
}

function updateJetpack() {
	_game.scrollBackgroundX(-2);		
	_game.checkOverlap(_currentPlayer, _obstacle, _hitObstacle);
	_game.checkOverlap(_currentPlayer, _fastObstacle, _hitObstacle);
	_game.checkOverlap(_currentPlayer, _coin, _collectedCoin, [_currentPlayer, _coin]);
	
	_score = _score + 1;
	
	_coinText.changeText(_coinsCollected);

	if(space.isDown()) { //checks for space key pressed
		if (_playerYVel > -200) {
			_playerYVel = _playerYVel - 10;
		}
		_player.playAnimation('up');
	} else {
		_player.playAnimation('down');
	}

	if((_currentPlayer.getY() > 550) && (_playerYVel>0)){ //collision sensing with world edge
		_currentPlayer.setY(550)
		_playerYVel = 0;
	}
	else if ((_currentPlayer.getY() < 0) && (_playerYVel<0)){
	 	_currentPlayer.setY(0);
		_playerYVel = 0;
	}
	else {
		if ((_playerYVel < 200) && (_currentPlayer.getY() < 550)) {
			_playerYVel = _playerYVel + 5; // gravity
		}		
	}
	
	_currentPlayer.setVelocityY(_playerYVel);
	
	
	if ( _score % 50 == 0) {  //create obstacle
		_latestObstacle = _obstacle.create(800,Math.floor(Math.random()*601),70,55);
		_latestObstacle.setVelocityX(-200 - (_score/25));  // gets faster as game progresses
		_latestObstacle.child.anchor.setTo(0.5,0.5);
	}
	
	if( _score % 37 == 0) { //create coin
		_latestCoin = _coin.create(800,Math.floor(Math.random()*601),25,25);
		_latestCoin.setVelocityX(-200 - (_score/25));
		_latestCoin.addAnimation('rotate', [0,1,2,3,2,1], 10);
		_coin.playAnimation('rotate');
	}
		
	if (_score % 180 == 0) { //creates fast obstacle
		_latestObstacle = _fastObstacle.create(800,Math.floor(Math.random()*601),164,85);
		_latestObstacle.setVelocityX(-300 - (_score/25));  // gets faster as game progresses
		//_latestObstacle.child.anchor.setTo(0.5,0.5);
		//_latestObstacle.setAngle(45);
	}

	_obstacle.setAngle((1.5 *_score)%360);

}

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
	levelScores.push(String(_coinsCollected));
	leaderboards[gm][levelName] = levelScores;
	localStorage.setItem("leaderboards", JSON.stringify(leaderboards));
}

function _hitObstacle(_thePlayer, _obstacleToKill) { //when you hit an obstacle game over

	_thePlayer.kill();
	_gameOver.create(75,225,650,124);
	handleLeaderboards();

	$("#jp").trigger("click");
	$("#meteormayhem").trigger("click");
	setTimeout(function() {
		_gameOver.setAlpha(0);
		$(".tutorial-container").fadeIn(1000);
		setTimeout(function() {
			window.location.href = 'map.html';
		}, 5000);
	}, 2500);
}

function _collectedCoin(_thePlayer, _coinToKill) {
	_coinToKill.kill();
	_coinsCollected += 1;
}

function resume() {
	_game.resume();
	paused = false;
	$(".menu-container").hide();
}

function pause() {
	_game.pause();
	paused = true;
	$(".menu-container").show();
}

$(document).ready(function() {
	$("#back_arrow").hide();
	$("stat").css("color", "red");
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