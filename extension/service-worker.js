const TEN_SECONDS_MS = 10 * 1000;
let stompClient = null;
let socket = null;

chrome.action.onClicked.addListener(async () => {
  console.log('chrome.action.onClicked');
  if (stompClient) {
    disconnect();
  } else {
    connect();
    keepAlive();
  }
});

function connect() {
  console.log('Connecting to WebSocket... by service worker');
  socket = new WebSocket('ws://localhost:8080/ws/chat');
  stompClient = Stomp.over(socket);

  stompClient.connect({}, function (frame) {
    chrome.action.setIcon({ path: 'icons/socket-active.png' });
    console.log('STOMP connection established');

    // 채팅방 구독
    stompClient.subscribe('/topic/chat', function (message) {
      console.log(JSON.parse(message.body));
    });
  });

  socket.onclose = () => {
    chrome.action.setIcon({ path: 'icons/socket-inactive.png' });
    console.log('websocket connection closed');
    stompClient = null;
    socket = null;
  };
}

function disconnect() {
  if (stompClient) {
    stompClient.disconnect();
  }
  if (socket) {
    socket.close();
  }
}

function keepAlive() {
  const keepAliveIntervalId = setInterval(
    () => {
      if (stompClient && stompClient.connected) {
        console.log('ping');
        stompClient.send('/app/chat.ping', {}, JSON.stringify({ type: 'PING' }));
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    TEN_SECONDS_MS
  );
}