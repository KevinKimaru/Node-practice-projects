const sock = io();

function onChatMessage(text) {
    const chatList = document.querySelector('#chat');
    const li = document.createElement('li');
    li.innerHTML = text;
    chatList.appendChild(li);
}

function sendMessage() {
    const sayField = document.querySelector('#say');
    const value = sayField.value;
    sock.emit('msg', value);
    sayField.value = '';
}

sock.on('msg', onChatMessage);

const btn = document.querySelector('#send');
btn.addEventListener('click', sendMessage, false);