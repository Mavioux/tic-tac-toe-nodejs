let board = document.getElementById("board");

let mark = 'X';
let myTurn = false;

let tile = document.createElement("div");
let tiles = [];
tile.id = "tile";

for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = "tile";
    tile.className = numToString(i);
    tiles[i] = tile;
    board.appendChild(tile);
    tile.addEventListener('click', ()=>{
        tile.innerHTML = mark;
    }, myTurn);
}

var socket = io();

socket.on('start game', ()=>{
    console.log('Game ready to start!')
})

socket.on('player 1 move', ()=>{
    myTurn = true;
    console.log("It's your turn!");

})

function numToString(i) {
    switch(i){
        case 0:
            return "zero";
            break;
        case 1:
            return "one";
            break;
        case 2:
            return "two";
            break;
        case 3:
            return "three";
            break;
        case 4:
            return "four";
            break;
        case 5:
            return "five";
            break;
        case 6:
            return "six";
            break;
        case 7:
            return "seven";
            break;
        case 8:
            return "eight";
            break; 
        default:
            return "null";
            break;          
    }
}