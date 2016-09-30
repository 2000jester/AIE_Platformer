var playerenemycollision = function(playerX, playerY, enemyX, enemyY, playerAlive, playerLive){
	if(player.isAlive == true){
		
		
		if (((playerX + 159 > enemyX) && (playerY > enemyY)) &&
		((playerX > enemyX) && (playerY < enemyY + 149)) && 
		((playerX < enemyX + 161) && (playerY + 163 > enemyY)) &&
		((playerX < enemyX + 161) && (playerY < enemyY + 149))) {
			playerLive = playerLive - 1;
		}
	
		
		
		
		
	}
}