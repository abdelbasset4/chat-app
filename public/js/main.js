const chatForm = document.getElementById('chat-form')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const chatMessage = document.querySelector('.chat-messages')
const socket = io();
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

socket.emit('joinRoom',{username,room})
socket.on('roomUsers',({room, users}) => {
    outputRoom(room);
    outputUsers(users);
})
socket.on('message',(message)=>{
    outputMessage(message)
    // scroll the chat message
    chatMessage.scrollTop = chatMessage.scrollHeight
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    // get input value
    const msgInput = e.target.elements.msg.value;

    // emit message to the server
    socket.emit('chatMessage',msgInput)
    // clear input value
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`;
    chatMessage.appendChild(div);
}
function outputRoom(room){
    roomName.innerHTML = room
}

function outputUsers(users){
    userList.innerHTML = '';
    users.forEach(user=> {
        const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
    });
}