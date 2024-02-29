// Define the PollStates enum
const PollStates = {
      AWAITING_POLL: 'awaitingPoll',
      IN_PROGRESS: 'inProgress',
      POLL_CLOSED: 'pollClosed'
};
    
window.addEventListener('load', () => {
      const page = 'game';
      const buttons = document.querySelectorAll('button');
      const pollStateDisplay = document.getElementById('pollStateDisplay');

      let lastPressedButton = null;
    
      ws.addEventListener('message', (event) => {
            const { pollState } = JSON.parse(event.data);
            console.log(`Received updated poll state: ${pollState}`);
    
            // Update the displayed poll state
            updatePollStateDisplay(pollState);
        
            // Handle the poll state change as needed in your game
            handlePollStateChange(pollState);
      });
    
      buttons.forEach((button) => {
            button.addEventListener('click', () => {
                  if (button.classList.contains('active')) {
                        if (lastPressedButton) {
                              lastPressedButton.classList.remove('lastPressed');
                        }
                        button.classList.add('lastPressed');
                        // console.log(lastPressedButton);
                        lastPressedButton = button;
                        // console.log( button);
                  }
            });
      });
      
      // Example: Handle poll state changes
      function handlePollStateChange(pollState) {
            switch (pollState) {
                  case PollStates.AWAITING_POLL:
                        buttons.forEach((button) => {
                              button.classList.remove('active', 'lastPressed');
                              button.disabled = true;
                        });
                        break;
                  case PollStates.IN_PROGRESS:
                        buttons.forEach((button) => {
                              button.classList.add('active');
                              button.disabled = false;
                        });
                        break;
                  case PollStates.POLL_CLOSED:
                        buttons.forEach((button) => {
                              button.classList.remove('active');
                              button.disabled = true;
                              if (button.classList.contains('lastPressed')) {
                                    sendMessageToServer(page, button.innerHTML, ws);
                              }
                              button.classList.remove('lastPressed');
                        });
                        break;
                  default:
                        console.warn(`Unknown poll state: ${pollState}`);
            }
      }
    
      // Function to update the displayed poll state
      function updatePollStateDisplay(newPollState) {
            pollStateDisplay.textContent = `Poll State: ${newPollState}`;
      }
});