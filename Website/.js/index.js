window.addEventListener("load", () => { 
      const page = 'index';
      const keyInput = document.getElementById("keyInput");
      const keySubmitButton = document.getElementById("keySubmitButton");
      const resultDisplay = document.getElementById("resultDisplay");
  
      ws.onmessage = (event) => {
            const receivedData = event.data;
            try{
                  const parsedMessage = JSON.parse(receivedData);
                  if (parsedMessage.login) {
                        resultDisplay.innerHTML = parsedMessage.login;
                        if (parsedMessage.login === "correct") {
                              setTimeout(() => {
                                    window.location.href = "game.html";
                              }, 3000);
                        }
                  }
                  console.log('Data received: ', parsedMessage);
            } catch (error) {
                  console.error("Error parsing message:", error);
            }
      }
  
      keySubmitButton.addEventListener("click", () => {
            console.log('click')
            const keyValue = keyInput.value;
            if (keyValue) {
                  sendMessageToServer(page, keyValue, ws);
            }
      });
});