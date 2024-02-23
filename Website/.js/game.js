window.addEventListener("load", () => {
      const page = "game";
      const buttons = document.querySelectorAll("button");
    
      buttons.forEach((button) => {
            button.addEventListener("click", () => {
                  sendMessageToServer(page, button.innerHTML, ws);
            });
      });
});
