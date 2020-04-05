const express = require('express');
const app = express();
const socketIO = require('socket.io');
const port = process.env.PORT || 8000;

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

app.get('/lobby', (req, res)=>{
    res.render('lobby')
})

let clients = {};
let players = [];
let playerCounter = -1; //Zero is our player 1
let player1 = true;
let gameStart = false;
let gameEnd = false;
let disconnected = false;
let tiles = ["", "", "", "", "", "", "", "", ""];

io.on('connection', (socket) => {
    console.log('user connected with id: ' + socket.id);
    let id = socket.id;

    socket.on('disconnect', function () {
        console.log('user disconnected with previous id: ' + id);
        console.log("players length: " + players.length)
        for(let i = 0; i < players.length; i++) {
            console.log(id + " " + players[i].socket.id);
            if(id == players[i].socket.id) {
                disconnected = true;
            }
        }

        console.log(disconnected);
        if(disconnected) {
            console.log('kanw reset')
            //Reset the game
            //Empty the players array
            players = [];
            //Set playercounter to -1
            playerCounter = -1;

            player1 = true;
            gameStart = false;
            gameEnd = false;
            disconnected = false;
            tiles = ["", "", "", "", "", "", "", "", ""];

            console.log("players length: " + players.length)

            delete clients[id];
            io.sockets.emit('refresh');
        }
        delete clients[socket.id];
    });

    if(playerCounter >= 1) {
        io.to(id).emit('room full')
    }

    socket.on('join', ()=>{
        console.log(id);
        playerCounter++;
        //Configure joined player attributes
        players[playerCounter] = {
            symbol: playerCounter == 0 ? 'O' : 'X',
            socket: socket
        };

        if(players.length == 2 && !gameStart) {
            //Emit to each player seperately their own symbol for the game and signal the start of the game
            for(let i = 0; i < players.length; i++) {
                io.to(players[i].socket.id).emit('start game', {
                    symbol: players[i].symbol
                })
            }
            //Player 1 starts
            let playerId = player1 ? 0 : 1;
            io.to(players[playerId].socket.id).emit('move', {
                symbol: players[player1 ? 0 : 1].symbol
            })
            gameStart = true;
        }
    })

    clients[id] = socket;

    

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
