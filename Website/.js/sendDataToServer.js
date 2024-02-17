// sendDataToServer.js
function sendMessageToServer(currentPage, toSend, ws) {
      const data = `${currentPage}:${toSend}`;
      ws.send(data);
  }  