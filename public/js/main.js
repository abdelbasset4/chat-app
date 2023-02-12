const chatForm = document.getElementById('chat-form')
const socket = io();

socket.on('message',(message)=>{
    console.log(message);
    outputMessage(message)
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    // get input value
    const msgInput = e.target.elements.msg.value;

    // emit message to the server
    socket.emit('chatMessage',msgInput)
})

function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta"> <span></span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}