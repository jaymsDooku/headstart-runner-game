/////////////////////////////////////////////////////////////////
///////////////	Global Variables  //////////////////////////////
///////////////////////////////////////////////////////////////
var game = new Game(600, 400, "Tutorial 5");
//player
var player;
//input
var keyboard, space;
//bottom platform
var platform;
//trees
var trees;
//used to set a delay between spawning trees
var lastTreeSpawn = 0;

//sound to play when jumping
var jumpingSound;

var currentPlayer;

/////////////////////////////////////////////////////////////////
///////////////	Functions //////////////////////////////////////
///////////////////////////////////////////////////////////////

function preload() {

	//set the background image
    game.loadBackgroundImage('background', "img/dino.png");
	//load in the player
	player = new Sprite("img/dinosaur.png", 32, 32);
	//load in the trees
    trees = new Sprite("img/tree.png");
	//load in the platform
    platform = new Sprite("img/platform_dino.png");


}

function create() {

	//set the background image
	game.setBackgroundImage('background');

	// Input
	keys = new Keyboard();
	space = keys.createSpaceKey();

	//create the player
	currentPlayer = player.create(50, game.gameHeight()-100);
	//create running animation
	currentPlayer.addAnimation('right', [0,1,2], 10);
	//make the player fall
	currentPlayer.setGravityY(100);
	//play the running animation
	currentPlayer.playAnimation('right');
	//create a platform at the bottom
	platform.create(0, "90", "100", 35);
	//prevent it from moving
	platform.setImmovable(true);

}


function update() {

	// Scroll the background
    game.scrollBackgroundX(-1);

	// Allow the player to be on top of the platform
    game.checkCollision(platform, player);

	// Check if player hit a tree
    game.checkCollision(trees, player, hitTree);

	// Spawn a tree
	if(game.getGameTime() > lastTreeSpawn) {

		var tree = trees.create(game.gameWidth()+10, game.gameHeight()-70);
		tree.setVelocityX(-100);

		lastTreeSpawn = game.getGameTime() + 2500;

	}

	// Only jump is the player is on the ground
	if((space.justPressed()) && (currentPlayer.onGround())) {

		currentPlayer.setVelocityY(-125);

	}

}

// Pause the game when the player hits a tree
function hitTree(tree, player) {

    game.setPaused(true);

}
