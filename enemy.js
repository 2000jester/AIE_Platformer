var Enemy = function(x, y){
	this.image = document.createElement("img");
	this.image.src = "enemy.png";

	//this.sprite = new Sprite("enemy.png");
	//this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[0, 1, 2, 3, 4, 5, 6, 7]);
	//this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[8, 9, 10, 11, 12]);
	//this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	//this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[52, 53, 54, 55, 56, 57, 58, 59]);
	//this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[60, 61, 62, 63, 64]);
	//this.sprite.buildAnimation(12, 8, 165, 126, 0.05,[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
	//
	//for(var i=0; i<ANIM_MAX; i++){
	//	this.sprite.setAnimationOffset(i, -55, -87);
	//	
	//}//
	
	
	this.position = new Vector2();
	this.position.set(x, y);
	this.velocity = new Vector2();
	this.moveRight = true;
	this.pause = 0;
	
	this.width = 161;
	this.height = 149;
	
	this.rotation = 0;
}

Enemy.prototype.update = function(dt, i){
	
	//this.sprite.update(dt);
	//console.log("enemy " + i + " " + "position" + this.position.x + " " + this.position.y);
	if(this.pause > 0)
	{
		this.pause -= dt;
	}
	else
	{
		var ddx = 0; // acceleration

		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE; // true if enemy overlaps right
		var ny = (this.position.y)%TILE; // true if enemy overlaps below
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

		if(this.moveRight){
			if(celldiag && !cellright) {
				ddx = ddx + ENEMY_ACCEL; // enemy wants to go right
		}
		else {
			this.velocity.x = 0;
			this.moveRight = false;
			this.pause = 0.5;
			}
		}
		
		if(!this.moveRight){
			if(celldown && !cell) {
				ddx = ddx - ENEMY_ACCEL; // enemy wants to go left
			}
		else {
			this.velocity.x = 0;
			this.moveRight = true;
			this.pause = 0.5;
			
			}
		}
		this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (dt * ddx),
		-ENEMY_MAXDX, ENEMY_MAXDX);
	}
	//console.log("enemy " + i + " " + "position" + this.position.x + " " + this.position.y);
}

Enemy.prototype.draw = function(){
	
	//old
	context.save();
	//console.log(this.moveright)
		context.translate(this.position.x - worldOffsetX, this.position.y);
		context.rotate(this.rotation);
		if (this.moveRight == true){
		context.scale(-1, 1);
		
		} else {
			context.scale(1, 1)
		}
		context.drawImage(this.image, -this.width/2, -this.height / 1.32);
	context.restore();

	
	//new
	//this.image.draw(context, this.position.x, this.position.y);
	//this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}