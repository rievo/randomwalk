let board;

let current = undefined;

let rows = 20;
let cols = 20;


let count = 0;

function setup(){
	createCanvas(600,600);
  board = new Board(rows,cols, width, height);
  strokeWeight(1);
  background(51);
  //frameRate(40);
  //board.createPath();
 
  
}


function draw(){

  for(let i = 0; i < 1; i++){
    board.doNextStep();
    
  }
  board.display();

  if(board.stack.length == 0){
    board.restart();
  }
}




class Board{
	constructor(rows, cols, width, height){
  	this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.height = height;
    
    this.colwidth = Math.floor(this.width / this.cols);
    this.colheight =  Math.floor(this.height / this.rows);

    this.stack = [];
    
    this.cells = [];
    for(let r = 0; r < this.rows; r++){
    	let row = [];
      for(let c = 0; c < this.cols; c++){
      	let cell = new Cell(c*this.colwidth, 
        r * this.colheight, 
        this.colwidth, 
        this.colheight, r, c, this);
        row.push(cell);
      }
      this.cells.push(row);
    }


    let initialcell = this.root();
    initialcell.visited = true;
    count++;
    this.stack.push(initialcell);
  }
  
  restart(){
    for(let r = 0; r < this.rows; r++){
    	let row = this.cells[r];
      for(let c = 0; c < this.cols; c++){
        let cell = row[c];
        cell.visited = false;
        cell.walls = [true, true, true, true]
      }
    }

    let initialcell = this.root();
    initialcell.visited = true;
    this.stack.push(initialcell);

    count = 0;
  }
  
  display(){
  	for(let r = 0; r <this.cells.length; r++){
    	let row =this.cells[r];
      for(let c = 0; c < row.length; c++){
      	row[c].display();
      }
    }
    
    current.display(true);
  }


  doNextStep(){
    if(this.stack.length > 0){
      current = this.stack.pop();

      let ns = current.availableNeighbours();
      if(ns.length > 0){
        this.stack.push(current)

        let random_n = ns[0];

        if(random_n != undefined){
          this.removeWall(current, random_n);
          random_n.visited = true;
          count++;
          this.stack.push(random_n);
        }
        
      }
    }
  }

  removeWall(a, b){

    if (a.col < b.col){  // a - b
      a.walls[1] = false;
      b.walls[3] = false;
    }else if(a.col > b.col){ // b - a
      b.walls[1] = false;
      a.walls[3] = false;
    }

    if(a.row < b.row){  // a
                        // b
      a.walls[2] = false;
      b.walls[0] = false;
    }else if(a.row > b.row){  // b
                              // a
      a.walls[0] = false;
      b.walls[2] = false;
    }
  }

  hasCellBeenVisited(r, c){

    return this.cells[r][c].visited;
   
  }


  root(){
  	return this.cells[getRandomInt(0,cols)][getRandomInt(0,rows)]; //Maybe random
  }
  
  output(cell){
    console.log("cell["+cell.row + "][" + cell.col +"]")
  }
  
}

class Cell{
	constructor(x, y, w, h, r, c, board){
  	this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
    this.row = r;
    this.col = c;
    
    this.board = board;

    this.visited = false;
    this.walls = [true, true, true, true] //Top, right, bot, left
    
  }
  
  getCenter(){
  	let res = createVector();
    res.x = this.pos.x + this.w/2;
    res.y = this.pos.y + this.h/2;
    return res;
  }
  
  display(iscurrent){


    noStroke();
    if(iscurrent == undefined || iscurrent == false){

      if(this.visited == true){
        fill(255);
      }else{
        fill(51);
      }
      
      rect(this.pos.x, this.pos.y, this.w, this.h);
    }else{
      fill(98, 119, 209);
    }
    rect(this.pos.x, this.pos.y, this.w, this.h);

    stroke(15);
    if(this.walls[0] == true){ //top
      line(this.pos.x, this.pos.y, this.pos.x + this.w, this.pos.y)
    }
    if(this.walls[1] == true){ //right
      line(this.pos.x + this.w, this.pos.y, this.pos.x + this.w, this.pos.y + this.h)
    }
    if(this.walls[2] == true){ //bottom
      line(this.pos.x, this.pos.y+ this.h, this.pos.x + this.w, this.pos.y+ this.h)
    }
    if(this.walls[3] == true){ //left
      line(this.pos.x, this.pos.y, this.pos.x , this.pos.y + this.h)
    }
  }
  

  getAllNeighbours(){
    let possibleNeighs = [];
    
   
    
  	if(this.row > 0){ //Check this.r -1
    
      	possibleNeighs.push(this.board.cells[this.row -1][this.col]);

    }
    
    if(this.col > 0){//Check this.c -1
    
      	possibleNeighs.push(this.board.cells[this.row][this.col -1]);
    
    }
    
    if(this.row < board.rows-1){ //Check this.r +1
    
      	possibleNeighs.push(this.board.cells[this.row + 1][this.col]);

    }

    
     if(this.col < board.cols - 1){ //Check this.r +1
    
      	possibleNeighs.push(this.board.cells[this.row ][this.col+1]);
      
    }
    
 
		shuffleArray(possibleNeighs);
   return possibleNeighs;
  }
  availableNeighbours(){
  
  	let possibleNeighs = [];
    
   
    
  	if(this.row > 0){ //Check this.r -1
    	if(this.board.hasCellBeenVisited(this.row -1, this.col) == false){
      	possibleNeighs.push(this.board.cells[this.row -1][this.col]);
      }
    }
    
    if(this.col > 0){//Check this.c -1
    	if(this.board.hasCellBeenVisited(this.row, this.col -1) == false){
      	possibleNeighs.push(this.board.cells[this.row][this.col -1]);
      }
    }
    
    if(this.row < board.rows-1){ //Check this.r +1
    	if(this.board.hasCellBeenVisited(this.row +1, this.col) == false){
      	possibleNeighs.push(this.board.cells[this.row + 1][this.col]);
      }
    }

    
     if(this.col < board.cols - 1){ //Check this.r +1
    	if(this.board.hasCellBeenVisited(this.row, this.col +1) == false){
      	possibleNeighs.push(this.board.cells[this.row ][this.col+1]);
      }
    }

		shuffleArray(possibleNeighs);
   return possibleNeighs;
    
  }
}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}