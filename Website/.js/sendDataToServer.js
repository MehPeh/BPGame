const ws = new WebSocket(`ws://${window.location.host}`);

function sendMessageToServer(currentPage, toSend, ws) {
      const data = `${currentPage}:${toSend}`;
      ws.send(data);
}
