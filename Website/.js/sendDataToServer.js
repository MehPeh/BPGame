// sendDataToServer.js
function sendMessageToServer(toSend, currentPage, ws) {
      const data = `${currentPage}:${toSend}`;
      ws.send(data);
  }  