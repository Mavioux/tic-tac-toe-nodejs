let board = document.getElementById("board");
let joinDiv = document.getElementById("join");
let name = document.getElementById('name');
let namepar = document.getElementById('namepar');
let waiting = document.getElementById('waiting');
let info = document.getElementById('playing-info');
let symbolDiv = document.getElementById('symbol');
let replayDiv = document.getElementById('reset');
let resetBtn = document.getElementById('reset-btn');

//Socket IO
let socket = io();

//boolean to check if joining the table is available
let joinable = true;
let joined = false; 

let symbol;
let myTurn = false;
let playerName = "Unknown"


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
            info.innerHTML = "Opponent's turn!";
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
        joinDiv.className = "hidden";
        waiting.classList.remove('hidden');
    }
})

//Event Listener for name Input
name.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      //Set the user's name to be equal to what they typed
      playerName = name.value;
      namepar.innerHTML = playerName;
    }
  });

//Event Listener for Reset Button
resetBtn.addEventListener('click', ()=>{
    console.log('Reset was pressed');
})


//Socket Listener
socket.on('room full', ()=>{
    console.log('room full')
    //If there are already two people in the room redirect the next connections to /lobby
    window.location.replace("/lobby");
})

socket.on('refresh', ()=>{
    console.log('ekana refresh');
    alert('Opponent left the game');
    window.location.reload();
    
})

socket.on('start game', (data)=>{
    symbol = data.symbol;
    symbolDiv.innerHTML = "Playing as " + symbol;
    console.log('Game ready to start!')
    waiting.className = 'hidden';
    info.innerHTML = "Opponent's turn!";
})

socket.on('move', (data)=>{
    myTurn = true;
    console.log("It's your turn!");
    info.innerHTML = "It's your turn!";
})

socket.on('update board', (data)=>{
    console.log('Client is updating its board now')
    console.log(numToString(data.position));
    console.log(data.symbol);
    let tempTile = document.getElementById(numToString(data.position));
    tempTile.innerHTML = data.symbol;
})

socket.on('win', ()=>{
    info.innerHTML = 'You won!';
    reset.classList.remove('hidden');
})

socket.on('lose', ()=>{
    info.innerHTML = 'You lost!';
    reset.classList.remove('hidden');
})


//Functions
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



//Script JS code for chat
let message = document.getElementById('message');
let btn = document.getElementById('send');
let output = document.getElementById('output');

if(message) {
    console.log('Message is initiated')
}
if(name) {
    console.log('name is initiated')
}

if(btn) {
    console.log('btn is initiated')
}

if(output) {
    console.log('output is initiated')
}



btn.addEventListener('click', ()=> {
    console.log(namepar.value)
    socket.emit('send message', {
        message: message.value,
        name: playerName
    })
    message.value = "";
})

// Execute a function when the user releases a key on the keyboard
message.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      btn.click();
    }
  });


//listen for events
socket.on('synchronise chat', (data)=> {
    output.innerHTML += '<p><strong>' + data.name + ": </strong>" + data.message + "</p>"
})

