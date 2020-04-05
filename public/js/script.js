var socket = io();

let message = document.getElementById('message');
let name = document.getElementById('name');
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
    console.log(name.value)
    socket.emit('send message', {
        message: message.value,
        name: name.value
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

