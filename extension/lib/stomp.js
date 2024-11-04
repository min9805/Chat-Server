// STOMP Over WebSocket 클라이언트 구현
class StompClient {
    constructor(webSocket) {
        this.ws = webSocket;
        this.connected = false;
        this.subscriptions = new Map();
    }

    connect(headers = {}, connectCallback, errorCallback) {
        this.ws.onmessage = (event) => this._handleMessage(event.data);
        this.ws.onopen = () => {
            this._transmit('CONNECT', headers);
            this.connected = true;
            if (connectCallback) connectCallback();
        };
        this.ws.onerror = (error) => {
            if (errorCallback) errorCallback(error);
        };
    }

    disconnect(disconnectCallback) {
        if (this.connected) {
            this._transmit('DISCONNECT', {});
            this.ws.close();
            this.connected = false;
            if (disconnectCallback) disconnectCallback();
        }
    }

    send(destination, headers = {}, body = '') {
        if (this.connected) {
            headers.destination = destination;
            this._transmit('SEND', headers, body);
        }
    }

    subscribe(destination, callback) {
        if (this.connected) {
            const subscriptionId = 'sub-' + Math.floor(Math.random() * 1000000);
            this.subscriptions.set(subscriptionId, callback);

            this._transmit('SUBSCRIBE', {
                'id': subscriptionId,
                'destination': destination
            });

            return {
                id: subscriptionId,
                unsubscribe: () => {
                    this._transmit('UNSUBSCRIBE', { 'id': subscriptionId });
                    this.subscriptions.delete(subscriptionId);
                }
            };
        }
    }

    _transmit(command, headers, body) {
        let frame = command + '\n';

        // Add headers
        for (const [key, value] of Object.entries(headers)) {
            frame += `${key}:${value}\n`;
        }

        frame += '\n';
        if (body) frame += body;
        frame += '\0';

        this.ws.send(frame);
    }

    _handleMessage(data) {
        const frames = data.split('\0');
        frames.pop(); // Remove empty element after last \0

        frames.forEach(frame => {
            const lines = frame.split('\n');
            const command = lines.shift();
            const headers = {};

            // Parse headers
            let line;
            while ((line = lines.shift()) && line.trim()) {
                const [key, value] = line.split(':');
                headers[key] = value;
            }

            // The rest is the body
            const body = lines.join('\n');

            switch (command) {
                case 'CONNECTED':
                    break;
                case 'MESSAGE':
                    if (headers.subscription && this.subscriptions.has(headers.subscription)) {
                        const callback = this.subscriptions.get(headers.subscription);
                        callback({ body, headers });
                    }
                    break;
            }
        });
    }
}

// Global Stomp object to maintain compatibility
window.Stomp = {
    over: function (ws) {
        return new StompClient(ws);
    }
};