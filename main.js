var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here











var canPause = false;
var isPaused = false;
var wasPaused = false;
var enemies = [];


var LAYER_OBJECT_TRIGGERS = 5;


var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var LAYER_COUNT = 5;
var LAYER_PLATFORMS = 0;
var LAYER_LADDERS = 1;
var LAYER_SIGNS = 2;
var LAYER_WATER = 3;
var LAYER_OBJECT_ENEMIES = 4;

var MAP = { tw: 80, th: 15 };
var TILE = 35;
var TILESET_TILE = TILE * 2;

var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14
var TILESET_COUNT_Y = 14;

var tileset = document.createElement("img");
tileset.src = "tileset.png"

function cellAtPixelCoord(layer, x,y){
	if(x<0 || x>SCREEN_WIDTH)
		return 1;
		// let the player drop of the bottom of the screen (this means death)
	if(y>SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};
function cellAtTileCoord(layer, tx, ty){
	if(tx<0 || tx>=MAP.tw)
		return 1;
	// let the player drop of the bottom of the screen (this means death)
	if(ty>=MAP.th)
		return 0;
	
	if (ty >= 0 && layer >= 0 && tx >= 0)
	{
		return cells[layer][ty][tx];
	}
	else
	{
		return 0;
	}
};
	
function tileToPixel(tile){
	return tile * TILE;
};
	
function pixelToTile(pixel){
	return Math.floor(pixel/TILE);
};
	
function bound(value, min, max){
	if(value < min)
		return min;
	if(value > max)
		return max;
	return value;
}

var worldOffsetX = 0;
function drawMap()
{
	var startX = -1;
	var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
	var tileX = pixelToTile(player.position.x);
	var offsetX = TILE + Math.floor(player.position.x % TILE);
	
	startX = tileX - Math.floor(maxTiles / 2);
	
	if (startX< -1){
		startX = 0;
		offsetX = 0;
	}
	if (startX > MAP.tw - maxTiles){
		startX = MAP.tw - maxTiles + 1;
		offsetX = TILE;
	}
	
	worldOffsetX = startX * TILE + offsetX;
	
	for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
	{
		
		for( var y = 0; y < level1.layers[layerIdx].height; y++ )
		{
			var idx = y * level1.layers[layerIdx].width + startX;
			for( var x = startX; x < level1.layers[layerIdx].width; x++ )
			{
				if( level1.layers[layerIdx].data[idx] != 0 )
				{
				// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one from the tileset id to get the
				// correct tile
				if(layerIdx != LAYER_OBJECT_ENEMIES){
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_X)) * (TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, (x - startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);	
					}
				}
				idx++;
			}
		}
	}
}

var musicBackground;
var sfxFire;
var cells = []; // the array that holds our simplified collision data
function initialize() {
	
	// add enemies
	idx = 0;
	for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) {
	for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) {
	if(level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
	var px = tileToPixel(x);
	var py = tileToPixel(y);
	var e = new Enemy(px, py);
	enemies.push(e);
	}
	idx++;
	}
	} 
	
	
	
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
		cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < level1.layers[layerIdx].height; y++) {
		cells[layerIdx][y] = [];
			for(var x = 0; x < level1.layers[layerIdx].width; x++) {
				if(level1.layers[layerIdx].data[idx] != 0 && layerIdx != LAYER_SIGNS && layerIdx != LAYER_WATER) {
					// for each tile we find in the layer data, we need to create 4 collisions
					// (because our collision squares are 35x35 but the tile in the
					// level are 70x70)
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				else if(cells[layerIdx][y][x] != 1 && layerIdx != LAYER_WATER) {
					// if we haven't set this cell's value, then set it to 0 now
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
	musicBackground = new Howl(
	{
	
		urls: ["background.ogg"],
		loop: true,
		buffer: true,
		volume: 0.3
	
	});
	musicBackground.play();
	
	sfxFire = new Howl(
	{
		urls: ["fireEffect.ogg"],
		buffer: true,
		volume: 1
	
	})
}     

var heartWidth = 20
var heartHeight = 19

var player = new Player();
var keyboard = new Keyboard();

var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 15;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

var heartImg = document.createElement("img");
heartImg.src = "heart.png";

function run(){	
	var deltaTime = getDeltaTime();

	if(keyboard.isKeyDown(keyboard.KEY_DELETE) == true){
	if (!wasPaused){
		isPaused = !isPaused
		wasPaused = true;
	}
	} else {
		wasPaused = false;
	}
		
	if (isPaused == true){
		context.fillStyle = "Black"
		context.font ="50px comic sans ms";
		context.fillText("PAUSED", (canvas.width / 2) - 100, canvas.height / 2)
	} else {
		
		
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	
	
	player.update(deltaTime);
	drawMap();
	player.draw();
	
	/*for (var i =0; i<enemies.length; i++){
	playerenemycollision(player.position.x, player.position.y, enemies[i].position.x, enemies[i].position.y, player.isAlive, playerLives);	
		}*/
	
	for(var i=0; i<enemies.length; i++)
	{
	enemies[i].update(deltaTime, i);
	enemies[i].draw();
	}
	
	context.fillStyle = "dimgrey";
	context.fillRect(0, 0, 79, 44);
	context.fillStyle = "black";
	context.fillRect(0, 0, 74, 39);
	
	for (var i = 0; i < player.lives; ++i){
		context.drawImage(heartImg, (canvas.width - canvas.width + 5) + ((heartWidth + 2) * i), 10, heartWidth, heartHeight);
	}
	
	//wasPaused = isPaused
	
	/*	
	update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	*/
	}
}

initialize();


















//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);