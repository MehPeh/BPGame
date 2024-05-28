// Define the PollStates enum
const PollStates = {
	AWAITING_POLL: "awaitingPoll",
	IN_PROGRESS: "inProgress",
	POLL_CLOSED: "pollClosed",
  };
  
  window.addEventListener("load", () => {
	const page = "vote";
	const buttons = document.querySelectorAll("button");
	const pollStateDisplay = document.getElementById("pollStateDisplay");
  
	let lastPressedButton = null;
  
	ws.onmessage = (event) => {
	    const receivedData = event.data;
	    try {
		  const parsedMessage = JSON.parse(receivedData);
		  if (!parsedMessage.state && !parsedMessage.pollOptions) {
			console.log("Message wasn't for us.");
			return;
		  }
		  //if (!Object.values(PollStates).includes(parsedMessage.state)) {
			//console.log("couldn't find pollstate in enum");
			//return;
		  //}
		  if (parsedMessage.state) {
			console.log(`Received updated poll state: ${parsedMessage.state}`);
		  	handlePollStateChange(parsedMessage.state);
		  }
		  // Update the buttons with the received pollOptions
		  if (parsedMessage.pollOptions) {
			handlePollOptions(parsedMessage.pollOptions);
		  }
	    } catch (error) {
		  console.error("Error parsing message:", error);
	    }
	};
  
	buttons.forEach((button) => {
	    button.addEventListener("click", () => {
		  if (button.classList.contains("active")) {
			if (lastPressedButton) {
			    lastPressedButton.classList.remove("lastPressed");
			}
			button.classList.add("lastPressed");
			lastPressedButton = button;
		  }
	    });
	});
  
	function handlePollStateChange(pollState) {
	    	switch (pollState) {
		  	case PollStates.AWAITING_POLL:
				buttons.forEach((button) => {
			    		button.classList.remove("active", "lastPressed");
			    		button.disabled = true;
					button.innerHTML = "";
				});
				break;
		  	case PollStates.IN_PROGRESS:
				buttons.forEach((button) => {
			    		button.classList.add("active");
			    		button.disabled = false;
				});
				break;
		  	case PollStates.POLL_CLOSED:
				buttons.forEach((button) => {
			    		button.classList.remove("active");
			    		button.disabled = true;
			    		if (button.classList.contains("lastPressed")) {
				  		sendMessageToServer(page, button.innerHTML, ws);
			    		}
			    		button.classList.remove("lastPressed");
					});
				break;
		  	default:
				console.warn(`Unknown poll state: ${pollState}`);
	    	}
	}
  
	// Function to update the button innerHTML based on the received pollOptions
	function handlePollOptions(pollOptions) {
	    	for (let i = 0; i < buttons.length; i++) {
		  	const buttonId = `keyOption${i + 1}`;
		  	const option = pollOptions[`option${i + 1}`];
		  	if (option) {
				// Update button innerHTML based on the option
				const optionName = Object.keys(option)[0];
                		const formattedOptionName = convertToTitleCase(optionName);
                		const formattedOptionValue = formatOptionValue(option[optionName]);
                		buttons[i].innerHTML = `${formattedOptionName} ${formattedOptionValue}`;
		  	} else {
				// If option is not provided, set innerHTML to default
				buttons[i].innerHTML = `innerHTML ${i + 1}`;
		  	}
	    	}
	}

	function convertToTitleCase(str) {
		return str.charAt(0).toUpperCase() + str.substr(1).replace(/[A-Z]/g, ' $&');
	}

	function formatOptionValue(optionValue) {
		switch (optionValue) {
		    	case "increase":
			  	return "+";
		    	case "increasePlus":
			  	return "++";
		    	case "decrease":
			  	return "-";
		    	case "decreasePlus":
			  	return "--";
		    	default:
			  	return "";
		}
	}
  });
  