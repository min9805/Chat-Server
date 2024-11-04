let stompClient = null;
const base62Encoder = new Base62Encoder();

function connect() {
    console.log('Connecting to WebSocket...');
    const socket = new WebSocket('ws://localhost:8080/ws/chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, async function (frame) {
        console.log('Connected: ' + frame);

        // 현재 탭의 URL을 가져와서 topic 생성
        try {
            const currentTab = await getCurrentTab();
            const topic = base62Encoder.sanitizeUrl(currentTab.url);
            console.log('Subscribing to topic:', topic);

            // topic별 채팅방 구독
            stompClient.subscribe(`/sub/${topic}`, function (message) {
                displayMessage(JSON.parse(message.body));
            });
        } catch (error) {
            console.error('Error subscribing to topic:', error);
        }
    });
}

function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');

    if (message.url) {
        messageElement.innerHTML = `${message.sender}: ${message.message} <br>`;
    } else {
        messageElement.textContent = `${message.sender}: ${message.message}`;
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

async function sendMessage(content) {
    if (stompClient && content) {
        try {
            const currentTab = await getCurrentTab();

            const chatMessage = {
                message: content,
                sender: '행복한띠용이',
                url: currentTab.url
            };

            stompClient.send(`/pub/chat.send`, {}, JSON.stringify(chatMessage));
            console.log('Message sent:', chatMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

document.getElementById('message-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const messageInput = document.getElementById('message-input');
    const content = messageInput.value.trim();

    if (content) {
        sendMessage(content);
        messageInput.value = '';
    }
});

// 페이지 로드시 연결
connect();