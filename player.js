var LEFT = 0;
var RIGHT = 1;
var playerLives;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;

var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_MAX = 6;
var PROMPTANIM = true

var buildInterval = 0;
var moonWalkAnim;


var Player = function() {
	 var moonWalkSpeed = prompt("Moonwalk? true or false (caps sensitive) p.s(for dev speed)")
	 moonWalkAnim = prompt("Moonwalk? true or false (caps sensitive) p.s(for dev anim)")
	
	// if (moonWalk == false){
	// buildInterval = 0.05
// } else if (moonWalk == true){
	// buildInterval = 0.15
// }

	buildInterval = 0.05;
	if (moonWalkSpeed == "true")
	{
			buildInterval = 0.1;
	}

	this.sprite = new Sprite("ChuckNorris.png");
	this.sprite.buildAnimation(12, 8, 165, 126, buildInterval,[0, 1, 2, 3, 4, 5, 6, 7]);
	this.sprite.buildAnimation(12, 8, 165, 126, buildInterval,[8, 9, 10, 11, 12]);
	this.sprite.buildAnimation(12, 8, 165, 126, buildInterval,[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	this.sprite.buildAnimation(12, 8, 165, 126, buildInterval,[52, 53, 54, 55, 56, 57, 58, 59]);
	this.sprite.buildAnimation(12, 8, 165, 126, buildInterval,[60, 61, 62, 63, 64]);
	this.sprite.buildAnimation(12, 8, 165, 126, buildInterval,[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
	
	for(var i=0; i<ANIM_MAX; i++){
		this.sprite.setAnimationOffset(i, -55, -87);
		
	}


	this.startPosition = new Vector2();
	this.startPosition.set(2*TILE, 7*TILE);

	this.position = new Vector2();
	this.position.set(this.startPosition.x, this.startPosition.y);
	
	this.width = 159;
	this.height = 163;
	
	this.offset = new Vector2();
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
	this.direction = LEFT;
	
	this.speedMultiplier = 1;
	
	this.lives = 3;
	this.isAlive = true
	   
};

Player.prototype.update = function(deltaTime){

	//if (keyboard.isKeyDown(keyboard.KEY_DELETE)){
	//		this.alive = true;
	//		this.lives = 3;
	//		this.respawn();
	//}

	playerLives = this.lives

	this.sprite.update(deltaTime);

	var left = false;
	var right = false;
	var jump = false;
	// check keypress events
	if(moonWalkAnim == "true"){
		if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) {
			left = true;
			this.direction = LEFT;
			if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && !this.jumping){
				this.sprite.setAnimation(ANIM_WALK_RIGHT);
				}
			}
		else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) {
			right = true;
			this.direction = RIGHT;
			if(this.sprite.currentAnimation != ANIM_WALK_LEFT && !this.jumping){
				this.sprite.setAnimation(ANIM_WALK_LEFT);
				}
			}
		else {
			if(this.jumping == false && this.falling == false){
				if (this.direction == LEFT){
					if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT){
						this.sprite.setAnimation(ANIM_IDLE_RIGHT)
					}
				} else {
					if (this.sprite.currentAnimation != ANIM_IDLE_LEFT){
						this.sprite.setAnimation(ANIM_IDLE_LEFT)
					}
				}
			}
		}
	} else if (moonWalkAnim == "false"){
		if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) {
			left = true;
			this.direction = LEFT;
			if(this.sprite.currentAnimation != ANIM_WALK_LEFT && !this.jumping){
				this.sprite.setAnimation(ANIM_WALK_LEFT);
				}
			}
		else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) {
			right = true;
			this.direction = RIGHT;
			if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && !this.jumping){
				this.sprite.setAnimation(ANIM_WALK_RIGHT);
				}
			}
		else {
			if(this.jumping == false && this.falling == false){
				if (this.direction == LEFT){
					if (this.sprite.currentAnimation != ANIM_IDLE_LEFT){
						this.sprite.setAnimation(ANIM_IDLE_LEFT)
					}
				} else {
					if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT){
						this.sprite.setAnimation(ANIM_IDLE_RIGHT)
					}
				}
			}
		}
	}
		
		
	if(keyboard.isKeyDown(keyboard.KEY_UP) == true) {
			jump = true;
		
	}
	
		
			var wasleft = this.velocity.x < 0;
			var wasright = this.velocity.x > 0;
			var falling = this.falling;
			var ddx = 0; // acceleration
			var ddy = GRAVITY;
		
			if (left)
				ddx = ddx - ACCEL; // player wants to go left
			else if (wasleft)
				ddx = ddx + FRICTION; // player was going left, but not any more
			
			if (right)
				ddx = ddx + ACCEL; // player wants to go right
			else if (wasright)
				ddx = ddx - FRICTION; // player was going right, but not any more
		
			if (jump && !this.jumping && !falling){
			ddy = ddy - JUMP; // apply an instantaneous (large) vertical impulse
			this.jumping = true;
		
		if (moonWalkAnim == "false"){
			if(this.direction == LEFT){
				this.sprite.setAnimation(ANIM_JUMP_LEFT)
			} else {
				this.sprite.setAnimation(ANIM_JUMP_RIGHT)
			}
		} else {
			if(this.direction == LEFT){
				this.sprite.setAnimation(ANIM_JUMP_RIGHT)
			} else {
				this.sprite.setAnimation(ANIM_JUMP_LEFT)
			}
		}
		 
		/*if (moonWalkAnim == "false"){
			if(this.direction == LEFT && this.sprite.currentAnimation != ANIM_JUMP_LEFT){
				this.sprite.setAnimation(ANIM_JUMP_LEFT)
			} else if(this.sprite.currentAnimation != ANIM_JUMP_RIGHT){
				this.sprite.setAnimation(ANIM_JUMP_RIGHT)
			}
		}else if (moonWalkAnim == "true"){
			if(this.direction == RIGHT && this.sprite.currentAnimation != ANIM_JUMP_LEFT){
				this.sprite.setAnimation(ANIM_JUMP_LEFT)
			} else if(this.sprite.currentAnimation != ANIM_JUMP_RIGHT){
				this.sprite.setAnimation(ANIM_JUMP_RIGHT)
					}
		}*/
		
	}
	// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
	if ((wasleft && (this.velocity.x > 0)) ||
		(wasright && (this.velocity.x < 0)))
	{
	// clamp at zero to prevent friction from making us jiggle side to side
		this.velocity.x = 0;
	}


	// we’ll insert code here later
	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the
	// player is a rectangle and is exactly the same size as a single tile.
	// So we know that the player can only ever occupy 1, 2 or 4 cells.
	
	// This means we can short-circuit and avoid building a general purpose
	// collision detection engine by simply looking at the 1 to 4 cells that
	// the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below
	//var px = (this.position.x)%
	var cellPlatform = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellWater = cellAtTileCoord(LAYER_WATER, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
	//var cellup = cellAtTileCoord(LAYER_PLATFORMS, tx, ty - 1);
	
	// If the player has vertical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their
	// y position:
	if (this.velocity.y > 0) {
		if ((celldown && !cellPlatform) || (celldiag && !cellright && nx)) {
			// clamp the y position to avoid falling into platform below
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0; // stop downward velocity
			this.falling = false; // no longer falling
			this.jumping = false; // (or jumping)
			ny = 0; // no longer overlaps the cells below
		} else if (this.velocity.y < 0) {
			if ((cellPlatform && !celldown) || (cellright && !celldiag && nx)) {
				// clamp the y position to avoid jumping into platform above
				this.position.y = tileToPixel(ty + 1);
				this.velocity.y = 0; // stop upward velocity
				// player is no longer really in that cell, we clamped them to the cell below
				cell = celldown;
				cellright = celldiag; // (ditto)
				ny = 0; // player no longer overlaps the cells below
			}
		}
		if (this.velocity.x > 0) {
			if ((cellright && !cellPlatform) || (celldiag && !celldown && ny)) {
				// clamp the x position to avoid moving into the platform we just hit
				this.position.x = tileToPixel(tx);
				this.velocity.x = 0; // stop horizontal velocity
				}
			}
			else if (this.velocity.x < 0) {
				if ((cellPlatform && !cellright) || (celldown && !celldiag && ny)) {
				// clamp the x position to avoid moving into the platform we just hit
				this.position.x = tileToPixel(tx + 1);
				this.velocity.x = 0; // stop horizontal velocity
			}
		}
	}
	
	if(cellWater ){
		GRAVITY = METER * 9.8 * 6;
	}
	
	
	
	if (player.position.y > canvas.height) {
		//player.position.y = canvas.height - canvas.height;
		this.onDeath();
	}
	
};

Player.prototype.draw = function(){
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);


	//context.fillStyle = "black"
	//context.font = '20px arial'
	//var livestext = "lives : " + this.lives
	//context.fillText(livestext, canvas.width - 80, 30)
};

Player.prototype.respawn = function(){
	
	this.position.set(this.startPosition.x, this.startPosition.y)
	this.sprite.setAnimation(ANIM_IDLE_RIGHT);
	this.falling = false;
	
}

Player.prototype.onDeath = function(){
	if (this.isAlive == true){
		this.lives = this.lives - 1;
	if (this.lives >= 0){
		this.respawn();
	} else {
		this.isAlive = false;
		this.lives = 0;
		location.reload();
	}
	}
}