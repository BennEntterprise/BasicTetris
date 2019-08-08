function playerDrop(){
	player.pos.y++;
	if(collide(arena,player)){
		player.pos.y--;
		merge(arena,player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}

module.exports= {playerDrop};
