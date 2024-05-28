const ws = new WebSocket(`ws://${window.location.host}`);

function sendMessageToServer(key, data, ws) {
      const message = {};
      message[key] = data;
      ws.send(JSON.stringify(message));
}
