function spawnEnemy(){
	var enemy = enemies.getFirstExists(false);
	enemy.anchor.setTo(0.5);
	enemy.reset(game.world.width, game.rnd.integerInRange(50, game.world.height - 50));
	enemy.body.velocity.x = -250; 
}

function selfDamage(player, enemy) {
	var explosion = explosions.getFirstExists(false);
	explosion.reset(player.body.x, player.body.y);
	explosion.play('smallboom'); //animation
	kaboom.play(); //sound

	//To do: add score
	enemy.kill();

	player.life -= 25;
	//To do: update HP text on screen
	if(player.life <= 0){
		player.kill();
		//to do: write game over function
	}
	else if(player.life <= 50){
		player.tint = '0xff0000';
	}
}