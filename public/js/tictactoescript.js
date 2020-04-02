let board = document.getElementById("board");

// let symbol  = 'X';
let myTurn = false;

let tile = document.createElement("div");
let tiles = [];
tile.id = "tile";

for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.className = "tile";
    tile.id = numToString(i);
    tiles[i] = tile;
    board.appendChild(tile);
    console.log(tile);
    tile.addEventListener('click', ()=>{
        if(myTurn && tile.innerHTML == ""){
            socket.emit('moved', {
                position: i
            })
            myTurn = false;
            console.log(i);
        }
    });
}

let socket = io();

socket.on('start game', ()=>{
    console.log('Game ready to start!')
})

socket.on('move', (data)=>{
    myTurn = true;
    console.log("It's your turn!");
})

socket.on('update board', (data)=>{
    console.log('Client is updating its board now')
    console.log(numToString(data.position));
    console.log(data.symbol);
    let tempTile = document.getElementById(numToString(data.position));
    tempTile.innerHTML = data.symbol;
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