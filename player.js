
var Player = function() {	
	this.image = document.createElement("img");
	this.x = canvas.width/2;
	this.y = canvas.height/2; 	
	this.width = 200;
	this.height = 200;	
	this.rotation = 0
	this.storeRotation = 0;
	this.speedMultiplier = 1;
	
	this.image.src = "hero.png";   
};

Player.prototype.update = function(deltaTime){		
	if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true) {
		this.rotation += (deltaTime * 2 * speedMultiplier);
		this.storeRotation = this.rotation;
	} else {
		this.rotation = this.storeRotation;
	};
	
	if (keyboard.isKeyDown(keyboard.KEY_W) == true) {
		this.y = this.y - 2 * speedMultiplier;
	};
	
	if (keyboard.isKeyDown(keyboard.KEY_S) == true) {
		this.y = this.y + 2 * speedMultiplier;
	};
	
	if (keyboard.isKeyDown(keyboard.KEY_A) == true) {
		this.x = this.x - 2 * speedMultiplier;
	};
	
	if (keyboard.isKeyDown(keyboard.KEY_D) == true) {
		this.x = this.x + 2 * speedMultiplier;
	};
	
	if (keyboard.isKeyDown(keyboard.KEY_SHIFT) == true) {
		this.rotation -= (deltaTime * 2 * speedMultiplier);
		this.storeRotation = this.rotation;
	} else {
		this.rotation = this.storeRotation;
	};
	
	if (keyboard.isKeyDown(keyboard.KEY_DELETE) == true) {
		speedMultiplier = 2
	} else {
		speedMultiplier = 1;
	};
	if (keyboard.isKeyDown(keyboard.KEY_UP) == true) {
		this.height = 200;
	} else {
		this.height = 200;
	}
	
};

Player.prototype.draw = function(){
	context.save();			
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);	
	context.restore();	
};