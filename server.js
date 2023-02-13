const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const messageFormat = require('./utils/message')
const {getCurrentUser,getRoomUsers,userJoin,userLeave} = require('./utils/users')
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection',(socket)=>{
    socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id, username, room)    
    socket.join(user.room)
    // this emit when user connect the chat
    socket.emit('message',messageFormat('chat bot','welcome for the chat'));
    // this emit tell all users except current user 
    socket.broadcast.to(user.room).emit('message',messageFormat('chat bot',`${user.username} join the chat`))
    
    // send user and room info
    io.to(user.room).emit('roomUsers',{
        room : user.room,
        users:getRoomUsers(user.room)
    })
    })

    // listen message input
    socket.on('chatMessage',msg=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',messageFormat(user.username,msg))
    });
    socket.on('disconnect',()=>{
        // this emit tell all users and current user
        const user = userLeave(socket.id)
        if(user){

            io.to(user.room).emit('message',messageFormat('chat bot',`${user.username} has left the chat`))
             // send user and room info
    io.to(user.room).emit('roomUsers',{
        room : user.room,
        users:getRoomUsers(user.room)
    })
    }
    })
    
})


const port = 3000 || process.env.PORT;

server.listen(port,()=>console.log('listening on port ' + port))