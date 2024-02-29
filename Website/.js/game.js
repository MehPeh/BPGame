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
                  sendMessageToServer(page, button.innerHTML, ws);
            });
      });
    
      // Example: Handle poll state changes
      function handlePollStateChange(pollState) {
            switch (pollState) {
                  case PollStates.AWAITING_POLL:
                        // Handle awaiting poll state
                        break;
                  case PollStates.IN_PROGRESS:
                        // Handle in-progress poll state
                        break;
                  case PollStates.POLL_CLOSED:
                        // Handle poll closed state
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