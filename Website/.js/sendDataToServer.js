const ws = new WebSocket(`ws://${window.location.host}`);

function sendMessageToServer(key, data, ws) {
      const message = `${key}:${data}`;
      ws.send(message);
}
