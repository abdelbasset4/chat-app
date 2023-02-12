const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection',(socket)=>{
    console.log('new connection happened'); 
    // this emit when user connect the chat
    socket.emit('message','welcome for the chat');
    // this emit tell all users except current user 
    socket.broadcast.emit('message','a new user join chat')

    socket.on('disconnect',(socket)=>{

        // this emit tell all users and current user
        io.emit('message','the user has left the chat')
    })
    // listen message input
    socket.on('chatMessage',msg=>{
        console.log(msg);
        io.emit('message',msg)
    });
})


const port = 3000 || process.env.PORT;

server.listen(port,()=>console.log('listening on port ' + port))