/////////////////////////////////////////////////////////////////
///////////////	Global Variables  //////////////////////////////
///////////////////////////////////////////////////////////////
var game = new Game(800, 600, "Map");

var keyboard;
var left, up, down;
var right, space;
var player;
var currentPlayer;
var loc;
var moved;
var timer;
var startingX, startingY, xJump, yJump;
var isMoving, targetX, targetY;
var selectButton;
var actualSelectButton;
var backToMenu;

/////////////////////////////////////////////////////////////////
///////////////	Functions //////////////////////////////////////
///////////////////////////////////////////////////////////////
function preload() {

	player = new Sprite("img/Sprites/idle_player.png", 24, 42);
	
	bufferL = new Sprite("img/Sprites/buffer.png", 35, 58);
	bufferR = new Sprite("img/Sprites/buffer.png", 35, 58);
	selectButton = new Sprite("img/selectlevel.png",277,42);
	
	game.loadBackgroundImage("Map_bg", "img/map_bg.png");
	
}

function create() {
	
	currentPlayer = player.create(70,300);

	player.collideWorldBounds(true)
	
	keyboard = new Keyboard();
	left = keyboard.createLeftKey();
	right = keyboard.createRightKey();
	space = keyboard.createSpaceKey();
	up = keyboard.createUpKey();
	down = keyboard.createDownKey();

	game.setBackgroundImage("Map_bg");
	
	actualSelectButton = new Text("Press 'Space' to select level!", (game.gameWidth()/2) - 150, game.gameHeight() - 40, "26px", "Gaegu", "#ffffff");
	actualSelectButton.setVisible(false);
	backToMenu = new Text("Press 'Back Space' to go back to main menu!", (game.gameWidth()/2) - 220, 10, "26px", "Gaegu", "#56585b");
	
	loc = 1;
	
	isMoving = false;
}


function update() {
	
		if (space.justPressed()) {
			loadLevel();
		}
		
		if (isMoving == true) {
			actualSelectButton.setVisible(false);
			
			if (currentPlayer.getX() == targetX && currentPlayer.getY() == targetY) {
				isMoving = false;
				if (((loc == 2 || loc == 3) || loc == 6) || loc == 7) {
						actualSelectButton.setVisible(true);
				} else {
						actualSelectButton.setVisible(false);
				}

			} else {
				if (currentPlayer.getX() > targetX) {
					currentPlayer.setX(currentPlayer.getX() -2);
				} else if (currentPlayer.getX() < targetX) {
					currentPlayer.setX(currentPlayer.getX() +2);
				}
				
				if (currentPlayer.getY() < targetY) {
					currentPlayer.setY(currentPlayer.getY()+2);
				} else if (currentPlayer.getY() > targetY) {
					currentPlayer.setY(currentPlayer.getY()-2);
				}
				
			}
			
		} else {
			
			if (right.justPressed()) {
				switch(loc) {
					case 1:
						loc += 1;
						isMoving = true;
						findTarget();
						break;
					case 2:
						loc += 1;
						isMoving = true;
						findTarget();
						break;
					case 3:
						loc += 1;
						isMoving = true;
						findTarget();
						break;
					case 6:
						loc -= 1;
						isMoving = true;
						findTarget();
						break;
					case 7:
						loc -= 1;
						isMoving = true;
						findTarget();
						break;
					case 8:
						loc -= 1;
						isMoving = true;
						findTarget();
						break;
				}


			} else if (left.justPressed()) {
				switch(loc) {
					case 2:
						loc -= 1;
						isMoving = true;
						findTarget();
						break;
					case 3:
						loc -= 1;
						isMoving = true;
						findTarget();
						break;
					case 4:
						loc -= 1;
						isMoving = true;
						findTarget();
						break;
					case 5:
						loc += 1;
						isMoving = true;
						findTarget();
						break;
					case 6:
						loc += 1;
						isMoving = true;
						findTarget();
						break;
					case 7:
						loc += 1;
						isMoving = true;
						findTarget();
						break;

				}
			} else if (up.justPressed() && loc == 5) {
				loc -= 1;
				isMoving = true;
				findTarget();
			} else if (down.justPressed() && loc == 4) {
				loc += 1;
				isMoving = true;
				findTarget();
			}
		}

}

function findTarget() {
	switch(loc) {
		case 1:
			targetX = 70;
			targetY = 300;
			break;
		case 2:
			targetX = 220;
			targetY = 300
			break;
		case 3:
			targetX = 490;
			targetY = 300;
			break;
		case 4:
			targetX = 730;
			targetY = 300;
			break;
		case 5:
			targetX = 730;
			targetY = 420;
			break;
		case 6:
			targetX = 490;
			targetY = 420;
			break;
		case 7:
			targetX = 220;
			targetY = 420;
			break;
		case 8:
			targetX = 70;
			targetY = 420;
			break;
	}
	
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function loadLevel() {
	switch(loc) {
		case 2:
			// load jetpack game
			setTimeout(function() {
				window.location.href = 'jetpack_game.html';
			}, 500);
			break;
		case 3:
			// load runner game
			setTimeout(function() {
				window.location.href = 'runner_grassland.html';
			}, 500);
			break;
		case 6:
			// load diving game
			setTimeout(function() {
				window.location.href = 'diving_game.html';
			}, 500);
			break;
		case 7:
			// load factory game 
			setTimeout(function() {
				window.location.href = 'nuclear_factory.html';
			}, 500);
			break;
	}
}

$(document).ready(function() {
	$(document).keydown(function(e) {
		if (e.which == 8) {
			e.preventDefault();
			setTimeout(function() {
				window.location.href = 'menu.html';
			}, 10);
		}
	});
});
