const auth = require('../middleware/auth');
// const messageSchema = require('../models/message')

const rounter = (server) => {
    var io = require('socket.io')(server);
    var name = "Rajbir"

    var io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('new user connected')
        socket.on('joining msg', (username) => {
            name = username;
            io.emit('chat message', `---${name} joined the chat---`);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
            io.emit('chat message', `---${name} left the chat---`);
        });
        socket.on('chat message', (msg) => {
            var store = msg.split(": ")
            // const newuser = new messageSchema({ from: store[0], to: store[2], message: store[1] });
            // newuser.save()
            socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
        });
    });
}

module.exports = rounter;