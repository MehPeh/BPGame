window.addEventListener("load", () => { 
      const page = 'index';
      const keyInput = document.getElementById("keyInput");
      const keySubmitButton = document.getElementById("keySubmitButton");
      const resultDisplay = document.getElementById("resultDisplay");
  
      ws.onmessage = (event) => {
            const receivedData = event.data;
            resultDisplay.innerHTML = `${receivedData}`;
            if (receivedData === "Data received successfully") {
                  setTimeout(() => {
                        window.location.href = "game.html";
                  }, 3000);
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