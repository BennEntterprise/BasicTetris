//Grab the game canvas and declare
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20,20);
const arena = createMatrix(12,20);


// const npC = document.getElementById('nPiece');
// const npContext = npC.getContext('2d');
// npContext.scale(80,60);
// const pieceStageArea = createMatrix(4,4);


//set colors to be used and the arena size.
const colors = [
	null,
	'red',
	'blue',
	'violet',
	'green',
	'purple',
	'orange',
	'pink',
]
function createMatrix(w,h) {
	//A function that creates the arena as a matrix, fill with "0" by default.
	// A "0" in the arena space means there is no part of a tile covering it.
	const matrix = [];
	while(h--){
		matrix.push(new Array(w).fill(0));
	};
	return matrix;
}

//An object representing the active player (piece that moves)
const player = {
	pos: {x: 0, y: 0},
	matrix: null,
	score:0,
};
//An object representing the NEXT active player (upcoming piece)
const nextPlayer = {
	pos: {x: 0, y: 0},
	matrix: null,
};

//Game Variables
let dropCounter = 0;  //Times how long it has been since the last drop.
let lastTime = 0;
let dropInterval = 1000; //Denotes the time between drops
let level = 0;

// TODO:  Implement a 'next piece' canvas to show the upcoming piece.
// 1) DONE: Create a spece on the document
// 2) DONE: Scale the context to fit a piece (5x5?)
// 3) DONE: Run the createPiece, store it in the 'nPiece' var/canvas
// 4) DONE: Implement a second create piece in player reset (First one actually calls 'createPiece and stores in next piece, the other just grabs the aformentioned next piece.')
// 5) DONE: Enjoy!
// 6) Refine the Aspect Ratio in the next View.




function arenaSweep(){
	let rowCount=1;
	outer: for(let y= arena.length-1; y > 0;--y){
		for(let x= 0; x <arena[y].length; ++x){
			if(arena[y][x]===0){
				continue outer;
			}
		}
		const row= arena.splice(y,1)[0].fill(0);
		arena.unshift(row);
		++y;
		player.score+= rowCount*10;
		rowCount*=2;
	}
}
function collide(arena, player){
	//
	//Collide decides if the player has hit another piece.
	//
	const [m,o] = [player.matrix, player.pos];
	for (let y=0 ; y< m.length; ++y ){
		for(let x=0; x < m[y].length; ++x){
			if(m[y][x]!==0 &&
			(arena[y + o.y]&&
			arena[y + o.y][x +o.x])!==0){
				return true;
			};
		};
	};
	return false;
}
function createPiece(){
	//A function to create the next piece
	//Switch Statetement to determine which piece the player will be next.
	const pieces='ILJOTSZ';
	const randPiece = pieces[pieces.length * Math.random() | 0]
	switch (randPiece){
		case 'T':
			return [
				[0,0,0],
				[1,1,1],
				[0,1,0],
				];
		case 'O':
			return [
				[2,2],
				[2,2],
				];
		case 'L':
			return [
				[0,3,0],
				[0,3,0],
				[0,3,3],
				];

		case 'J':
			return [
				[0,4,0],
				[0,4,0],
				[4,4,0],
				];
		case 'I':
			 return [
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0],
				[0,5,0,0],
				];
		case 'S':
			return [
				[0,6,6],
				[6,6,0],
				[0,0,0],
				];

		case 'Z':
			return [
				[0,6,6],
				[6,6,0],
				[0,0,0],
				];

	};
}
function draw(){
	//function responisble for drawing:
	// 1 the black canvas
	// 2 the arena as it stands that instance
	// 3 the plyaer as it stands that instance

	//Take care of the
	context.fillStyle = '#000';
	context.strokeStyle = '#fff';
	context.fillRect(0,0,canvas.width, canvas.height);
	drawOnGameMatrix(arena, {x: 0, y: 0});
	drawOnGameMatrix(player.matrix,player.pos);

	// npContext.fillStyle ='#111';
	// npContext.strokeStyle = '#fff';
	// npContext.fillRect(0,0,canvas.width, canvas.height);
	// drawOnStagingMatrix(nextPlayer.matrix,{x: 0, y:0}); //TODO Create this Function
}
function drawOnGameMatrix (matrix,offset){
	//Draws a givin matrix (arena, or player) starting at the offset {x,y}
	matrix.forEach((row, y) => {
		row.forEach((value,x) =>{
			//If its not 0 ==(black) style appripriately
			if(value!==0){
				context.fillStyle=colors[value];
				context.fillRect(
					x + offset.x,
				 	y + offset.y,
				 	1,1);
			}
		});
	});
}
function drawOnStagingMatrix (matrix,offset){
	//Draws a givin matrix (arena, or player) starting at the offset {x,y}
	matrix.forEach((row, y) => {
		row.forEach((value,x) =>{
			//If its not 0 ==(black) style appripriately
			if(value!==0){
				npContext.fillStyle=colors[value];
				npContext.fillRect(
					x + offset.x,
				 	y + offset.y,
				 	1,1);
			}
		});
	});
}
function merge(arena,player){
	//Moves the player matrix into the arena matrix
	//This function will be called when there is a collision detected on a drop
	player.matrix.forEach((row,y) =>{
		row.forEach((value,x) =>{
			if(value!==0){
				arena[y + player.pos.y][x + player.pos.x]= value;
			}
		});
	});
}
function playerMove(dir){
	//Move left or right depending on keypress
	player.pos.x += dir;

	//Checks to make sure a player isnt moving into an existing tower. If it is,
	//the will be moved back. (removing this line allows for quantum tunneling)
	if(collide(arena,player)){
		player.pos.x -= dir;
	}
}
function playerReset(){
	// console.log('PlayerReset');
	//Grab previously set 'nextPlayer' then create a new nextPlayer
	player.matrix = nextPlayer.matrix;
	nextPlayer.matrix = createPiece();

	//Set the position of the player centered at top of the canvas.
	//Y is as low as possible. X is the averave of the left and right side of matrix, less half the player space.
	player.pos.y=0;
	player.pos.x =
		(arena[0].length / 2 | 0) -
		(player.matrix[0].length /2 | 0);

	//Take the arena and player to check for collission. If there is (at this zero point) then the game is over.
	//// TODO: {Create an end screen that displays final score}
	if(collide(arena,player)){
		arena.forEach(row => row.fill(0));
		player.score= 0;
		updateScore();
	};


}
function playerRotate(dir){
	//Rotates the player based on a keypress.
	const pos = player.pos.x;
	let offset = 1;
	rotate( player.matrix , dir );

	while ( collide(arena,player) ) {
		player.pos.x = player.pos.x + offset;
		offset = -1*(offset + (offset > 0 ? 1 : -1));
		if(offset > player.matrix[0].length){
			rotate(player.matrix, -1*dir);
			player.pos.x = pos;
			return;
		}
	}
}
function rotate(matrix, dir){
	//Rotates a matrix in a given direction.
	for(let y = 0; y < matrix.length; ++y) {
		for(let x= 0; x < y; ++x) {
				[
					matrix[x][y],
					matrix[y][x],
				] = [
					matrix[y][x],
					matrix[x][y],
				];
		}
	}

	if(dir > 0){
		matrix.forEach(row => row.reverse());
	} else{
		matrix.reverse();
	};

}
function playerDrop(){
	//Move the player down and tests for a collision.
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
function update(time=0){
	// console.log('Update');
	//Update the drop interval (Speed that the piece falls) based on player score.
	//The smaller the drop interval, the faster the fall.
	dropInterval = 1000- document.getElementById('score').innerText;
	const deltaTime = time- lastTime;
	lastTime = time;

	dropCounter += deltaTime;
	if(dropCounter> dropInterval){
		playerDrop();
	}
	draw();
	requestAnimationFrame(update);
}
function updateScore(){
	// console.log('UpdateScore');
	//A function to update the score and level of the game.
	document.getElementById('score').innerText = player.score;
	level = Math.floor(player.score /100);
	document.getElementById('level').innerText= level;
}
function initialize(){
	// console.log('Initialize');
	nextPlayer.matrix = createPiece();
}

document.addEventListener('keydown',event => {
	//Switch Statement to Move the player based on the keypress.
	switch(event.keyCode){
		//Move Player to the left
		case 37:
			playerMove(-1);
			break;
		//Move player to the right
		case 39:
			playerMove(+1);
			break;
		//Move player down.
		case 40:
			playerDrop();
			break;
		case 81:
		//Rotate player Counter Clockwise
			playerRotate(-1);
			break;
		//Move Player Clockwise
		case 87:
			playerRotate(1);
			break;
	};
});

initialize();
playerReset();
updateScore();
update();
