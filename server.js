const express = require('express');
const app = express();
const socketIO = require('socket.io');
const port = 8000;

let server = app.listen(port, ()=> console.log(`Server listening on localhost:${port}.`));
var io = socketIO(server);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//Static files
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/tictactoe', function(req, res) {
  res.render('tictactoe');
});

let players = {};
let ids = []
let counter = 0;

io.on('connection', (socket)=> {
    console.log('user connected with id: ' + socket.id);
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });

    let id = socket.id;

    players[id] = socket;
    ids[counter] = 0;
    counter++;

    if(Object.keys(players).length > 1) {
      io.sockets.emit('start game');
      //Player 1 starts
      socket.on('move');
    }

    socket.on('send message', (data)=> {
      console.log(data.name + " : " + data.message);
      io.sockets.emit('synchronise chat', data)
    });

})
