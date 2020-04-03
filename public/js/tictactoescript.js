let board = document.getElementById("board");
let joinDiv = document.getElementById("join");

//Socket IO
let socket = io();

//boolean to check if joining the table is available
let joinable = true;
let joined = false; 

// let symbol  = 'X';
let myTurn = false;

//Initialize board
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

//Create the join button
let button = document.createElement("button");
button.id = "join-btn";
button.innerHTML = "Join!";
joinDiv.appendChild(button);

//Add Event Listener for join button
button.addEventListener('click', ()=>{
    if(!joined) {
        socket.emit('join');
        joined = true;
    }
})


socket.on('room full', ()=>{
    console.log('room full')
    //If there are already two people in the room redirect the next connections to /lobby
    window.location.replace("/lobby");
})

socket.on('refresh', ()=>{
    console.log('ekana refresh');
    window.location.reload();
})

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