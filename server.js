const express = require('express');
const app = express();
const socketIO = require('socket.io');
const port = 8000;

let server = app.listen(port, () => console.log(`Server listening on localhost:${port}.`));
var io = socketIO(server);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Static files
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/tictactoe', function (req, res) {
    res.render('tictactoe');
});

let clients = {};
let players = [];
let playerCounter = -1; //Zero is our player 1
let player1 = true;
let gameStart = false;
let gameEnd = false;
let tiles = ["", "", "", "", "", "", "", "", ""];

io.on('connection', (socket) => {
    console.log('user connected with id: ' + socket.id);
    let id = socket.id;
    playerCounter++;

    socket.on('disconnect', function () {
        console.log('user disconnected');
        delete clients[socket.id];
        playerCounter--;
    });

    clients[id] = socket;

    //Configure player attributes
    players[playerCounter] = {
        symbol: playerCounter == 0 ? 'O' : 'X',
        socket: socket
    };

    if(players.length == 2 && !gameStart) {
        io.sockets.emit('start game');
        //Player 1 starts
        let playerId = player1 ? 0 : 1;
        io.to(players[playerId].socket.id).emit('move', {
            symbol: players[player1 ? 0 : 1].symbol
        })
        gameStart = true;
    }

    socket.on('moved', (data)=>{
        console.log("I heard your move")
        let playerId = player1 ? 0 : 1;
        let symbol = players[playerId].symbol;
        tiles[data.position] = symbol;
        console.log(tiles);

        //Next Player now gets to play
        player1 = !player1;

        //Emit to both sockets the previous move
        io.sockets.emit('update board', {
            position: data.position,
            symbol: symbol
        })

        //Emit to the next player
        playerId = player1 ? 0 : 1;
        io.to(players[playerId].socket.id).emit('move', {
            symbol: players[player1 ? 0 : 1].symbol
        })
    })

    socket.on('send message', (data) => {
        console.log(data.name + " : " + data.message);
        io.sockets.emit('synchronise chat', data)
    });

})
