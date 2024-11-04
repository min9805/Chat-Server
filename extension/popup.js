let stompClient = null;
const base62Encoder = new Base62Encoder();

// 랜덤 닉네임 생성 함수
function generateNickname() {
    const adjectives = [
        '행복한', '즐거운', '신나는', '귀여운', '멋진',
        '똑똑한', '현명한', '친절한', '활기찬', '열정적인',
        '다정한', '유쾌한', '상냥한', '재미있는', '사랑스러운'
    ];

    const nouns = [
        '곰돌이', '토끼', '강아지', '고양이', '판다',
        '코알라', '펭귄', '다람쥐', '여우', '사자',
        '호랑이', '기린', '코끼리', '햄스터', '돌고래'
    ];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}`;
}

// 닉네임을 저장할 변수
const nickname = generateNickname();
console.log('Generated nickname:', nickname);

function connect() {
    console.log('Connecting to WebSocket...');
    const socket = new WebSocket('ws://localhost:8080/ws/chat');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, async function (frame) {
        console.log('Connected: ' + frame);

        try {
            const currentTab = await getCurrentTab();
            const topic = base62Encoder.sanitizeUrl(currentTab.url);
            console.log('Subscribing to topic:', topic);

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
                sender: nickname,  // 생성된 닉네임 사용
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