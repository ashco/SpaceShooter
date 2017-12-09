function fireWeapon(){
	if(game.time.now < weaponTimer){
		return; 
	}
	
	console.log('fire de weps');
	var weapon = lasers.getFirstExists(false);
	weapon.reset(player.x, player.y + WEAPONS[0].offset);
	weapon.body.velocity.x = WEAPONS[0].velocity;

	pewpew.play();
	weaponTimer = game.time.now + WEAPONS[0].timer; 
}