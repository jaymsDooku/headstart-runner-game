function removeFromArray(el, array) {
	var index = array.indexOf(el);
	if (index > -1) { 
		array.splice(index, 1);
	}
}

function nextInt(range) {
	return Math.floor(Math.random() * range); 
}

function randomArrayItem(array) {
	var arrayLength = array.length;
	if (arrayLength == 1) return array[0];
	return array[nextInt(arrayLength)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/////////////////////////////////////////////////////////////////
///////////////	Global Variables  //////////////////////////////
///////////////////////////////////////////////////////////////
var game = new Game(800, 600, "Tutorial 1");

const DISPLACE_X = 800;

const PICKUP_VEL_Y = 400;
const PICKUP_SPAWN_TIME_MIN = 1000;
const PICKUP_SPAWN_TIME_MAX = 2000;

const OBSTACLE_VEL_Y = 400;
const OBSTACLE_SPAWN_TIME_MIN = 500;
const OBSTACLE_SPAWN_TIME_MAX = 1000;

const LANE_UNLOAD_INTERVAL = 1000;

//Sprites
var playerIdleWidth;
var playerIdleHeight;
var playerIdleWidthScale = 3;
var playerIdleHeightScale = 3;
var playerIdle;
var playerYThreshold;

function playerHeight() {
	return playerIdleHeight * playerIdleHeightScale;
}

function playerWidth() {
	return playerIdleWidth * playerIdleWidthScale;
}

var idlePlayer;
var runningPlayer;

var currentLaneIndex = nextLaneIndex = 0;
var isMoving = false;

var laneCount = 3;
//var laneTexture;
var lanes = [];

var stoneTexture;
var treeTexture;
var obstacleTextures = [];
var obstacles = [];
var nextObstacleSpawn = 0;
var nextObstacleSpawnLane = 0;
var obstacleAngle = 0;

var pickUpTextures = [];
var pickUps = [];
var nextPickUpSpawn = 0;
var nextPickUpSpawnLane = 0;

var pickUpScore = {
	cola: 0,
	plants: 0
};

var colaScoreText;
var colaScoreImg;

var cokeWidth;
var cokeHeight;
var cokeTexture;

var startTime;
var finishTime;
var duration;

var timeText;

//Utilities
var keyboard;
var left;
var right;
var space;

var pauseText;
var paused = false;

var wellDoneText;

var gm = 0;
var levelName = "Littered Grassland";
var won = false;

var gameOver;

/////////////////////////////////////////////////////////////////
///////////////	Functions //////////////////////////////////////
///////////////////////////////////////////////////////////////
function preload() {
	//Load assets
	//laneTexture = new Sprite("img/platform.png");
	game.loadBackgroundImage("background_1", "img/grass.png");
	
	playerIdleWidth = 13;
	playerIdleHeight = 20;
	playerIdle = new Sprite("img/running player transparent.png", playerIdleWidth, playerIdleHeight);
	playerIdle.setAlpha(1);
	
	//obstacle textures
	stoneTexture = new Sprite("img/stone.png");
	treeTexture = new Sprite("img/tree.png");
	obstacleTextures.push(stoneTexture);
	obstacleTextures.push(treeTexture);
	
	cokeWidth = 101;
	cokeHeight = 101;
	cokeTexture = new Sprite("img/coke-can.png", cokeWidth, cokeHeight);
	pickUpTextures.push(cokeTexture);
	
	gameOver = new Sprite("img/gameover1.png",520,99);
}

function createLanes() {
	lanes = [];
	var laneWidth = game.gameWidth() / laneCount;
	for (i = 0; i < 3; i++) {
		var lx = i * laneWidth;
		//var l = laneTexture.create(lx, 0, laneWidth, game.gameHeight());
		var middleX = (lx + (laneWidth/2)) - (playerWidth()/2);
		var laneObj = {
			middle: middleX,
			queue: [],
			nextUnloadTime: 0
		};
		lanes.push(laneObj);
	}
}

function randomObstacleTexture() {
	return randomArrayItem(obstacleTextures);
}

function randomPickUpTexture() {
	return randomArrayItem(pickUpTextures);
}

function newRunnerItem(laneIndex, texture, xOffset, y, width, height, velocity, allItems) {
	var x = (lanes[laneIndex].middle) + xOffset;
	var runnerItem = texture.create(x, y, width, height);
	runnerItem.setVelocityY(velocity);
	allItems.push(runnerItem);
}

function newObstacle(laneIndex) {
	newRunnerItem(laneIndex, randomObstacleTexture(), -25, 0, 100, 100, OBSTACLE_VEL_Y, obstacles);
}

function newPickUp(laneIndex) {
	newRunnerItem(laneIndex, randomPickUpTexture(), -25, 0, 100, 100, PICKUP_VEL_Y, pickUps);
}

function create() {
	//Initialize player.
	/*runningPlayer = playerRun.create(50, 50);
	runningPlayer.addAnimation('running', [0, 1, 2, 3, 4, 5, 6, 7], 10);
	runningPlayer.playAnimation('running');*/
	game.setBackgroundImage("background_1", 800, 600, 0, 0);
	
	createLanes();
	
	nextObstacleSpawnLane = 0;
	nextPickUpSpawnLane = lanes.length - 1;
	
	playerYThreshold = game.gameHeight() - playerHeight() - 150;
	idlePlayer = playerIdle.create(lanes[currentLaneIndex].middle, playerYThreshold, playerWidth(), playerHeight());
	idlePlayer.addAnimation('idle', [0, 1], 10);
	idlePlayer.playAnimation('idle');
	
	var colaScoreImgX = game.gameWidth() - 50;
	var colaScoreImgY = 10;
	colaScoreImg = cokeTexture.create(colaScoreImgX, colaScoreImgY, cokeWidth / 2, cokeHeight / 2);
	colaScoreText = new Text("0 / 10", colaScoreImgX - 60, colaScoreImgY, "20px", "Gaegu", "#ffffff");
	
	startTime = game.getGameTime();
	timeText = new Text("", 10, colaScoreImgY, "20px", "Gaegu", "#ffffff");
	
	pauseText = new Text("Press 'P' to pause game.", (game.gameWidth()/2)- 100, 10, "20px", "Gaegu", "#ffffff");
	
	keyboard = new Keyboard();
	left = keyboard.createLeftKey();
	right = keyboard.createRightKey();
	space = keyboard.createSpaceKey();
}

function move(direction) {
	if (isMoving) return;
	switch (direction) {
		case 1:
			nextLaneIndex++;
			if (nextLaneIndex >= (lanes.length - 1)) {
				nextLaneIndex = lanes.length - 1;
			}
			if (nextLaneIndex != currentLaneIndex) {
				idlePlayer.setVelocityX(DISPLACE_X);
				isMoving = true;
			}
			break;
		case -1:
			nextLaneIndex--;
			if (nextLaneIndex <= 0) {
				nextLaneIndex = 0;
			}
			if (nextLaneIndex != currentLaneIndex) {
				idlePlayer.setVelocityX(-DISPLACE_X);
				isMoving = true;
			}
			break;
		default:
			break;
	}
}

function movementCheck() {
	var nextLane = lanes[nextLaneIndex];
	var diff = currentLaneIndex - nextLaneIndex;
	if (diff > 0) {
		if (idlePlayer.getX() <= nextLane.middle) {
			idlePlayer.setVelocityX(0);
			currentLaneIndex = nextLaneIndex;
			isMoving = false;
		}
	} else if (diff < 0) {
		if (idlePlayer.getX() >= nextLane.middle) {
			idlePlayer.setVelocityX(0);
			currentLaneIndex = nextLaneIndex;
			isMoving = false;
		}
	}
}

function spawnObstacles() {
	var curTime = game.getGameTime();
	if (curTime > nextObstacleSpawn) {
		lanes[nextObstacleSpawnLane].queue.push("obstacle");
		nextObstacleSpawn = curTime + getRandomInt(OBSTACLE_SPAWN_TIME_MIN, OBSTACLE_SPAWN_TIME_MAX);
		nextObstacleSpawnLane = nextInt(lanes.length);
	}
}

var pushBack = null;

function updateObstacles() {
	for (i = 0; i < obstacles.length; i++) {
		var o = obstacles[i];
		game.checkCollision(o, idlePlayer, function() {
			o.setVelocityY(OBSTACLE_VEL_Y);
			if (pushBack == null) {
				pushBack = setInterval(function() { 
					if (idlePlayer.getY() > playerYThreshold) {
						idlePlayer.setVelocityY(-5 * 2); 
					}
				}, 100);
			}
		});
	}
}

function spawnPickUps() {
	var curTime = game.getGameTime();
	if (curTime > nextPickUpSpawn) {
		lanes[nextPickUpSpawnLane].queue.push("pickup");
		nextPickUpSpawn = curTime + getRandomInt(PICKUP_SPAWN_TIME_MIN, PICKUP_SPAWN_TIME_MAX);
		nextPickUpSpawnLane = nextInt(lanes.length);
	}
}

function updatePickUps() {
	for (i = 0; i < pickUps.length; i++) {
		var p = pickUps[i];
		var parentName = p.child.key;
		game.checkOverlap(p, idlePlayer, function() {
			if (parentName == cokeTexture.name) {
				pickUpScore.cola++;
				p.kill();
			}
		});
	}
}

function updateRunnerItems() {
	spawnObstacles();
	updateObstacles();
	
	spawnPickUps();
	updatePickUps();
}

function updateLanes() {
	for (i = 0; i < lanes.length; i++) {
		var l = lanes[i];
		var curTime = game.getGameTime();
		if (curTime > l.nextUnloadTime) {
			var type = l.queue.shift();
			switch (type) {
				case "obstacle":
					newObstacle(i);
					break;
				case "pickup":
					newPickUp(i);
					break;
			}
			l.nextUnloadTime = curTime + LANE_UNLOAD_INTERVAL;
		}
	}
}

function updateScore() {
	colaScoreText.changeText(pickUpScore.cola + " / 10");
}

function updateTime() {
	var curTime = game.getGameTime();
	var diff = curTime - startTime;
	duration = (diff / 1000).toFixed(1);
	timeText.changeText(String(duration) + " seconds");
}

function checkWinCondition() {
	if (pickUpScore.cola == 10) {
		won = true;
		finishGame();
	}
}

function handleLeaderboards() {
	if (!won) return;
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
	levelScores.push(String(duration));
	leaderboards[gm][levelName] = levelScores;
	localStorage.setItem("leaderboards", JSON.stringify(leaderboards));
}

function finishGame() {
	game.pause();
	
	if (!won) {
		gameOver.create(75,225,650,124);
		setTimeout(function() {
			window.location.href = 'map.html';
		}, 1500);
		return;
	}
	
	updateTime();
	finishTime = game.getGameTime();
	
	wellDoneText = new Text("Congratulations, you finished in " + duration + " seconds!", game.gameWidth()/2 - 250, game.gameHeight()/2-20, "30px", "Gaegu", "#ffffff");
	handleLeaderboards();

	$("#lr").trigger("click");
	$("#grassland").trigger("click");
	setTimeout(function() {
		wellDoneText.setVisible(false);
		$(".tutorial-container").fadeIn(1000);
		setTimeout(function() {
			window.location.href = 'map.html';
		}, 5000);
	}, 2500);
}

function update() {
	checkWinCondition();
	//if lost game
	if (idlePlayer.getY() >= game.gameHeight()) {
		finishGame();
	}
	
	if (idlePlayer.getY() <= playerYThreshold) {
		idlePlayer.setVelocityY(0);
		pushBack = null;
	}
	
	var direction = 0; 
	if (right.isDown()) {
		direction = 1;
	}
	if (left.isDown()) {
		direction = -1;
	}
	move(direction);
	movementCheck();
	
	updateRunnerItems();
	updateScore();
	updateTime();
	updateLanes();
}

function resume() {
	game.resume();
	paused = false;
	$(".menu-container").hide();
}

function pause() {
	game.pause();
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
