// Define the PollStates enum
const PollStates = {
	AWAITING_POLL: "awaitingPoll",
	IN_PROGRESS: "inProgress",
	POLL_CLOSED: "pollClosed",
};

window.addEventListener("load", () => {
	const page = "vote";
	const buttonsContainer = document.getElementById("content");
	const buttons = buttonsContainer.querySelectorAll("button");
	let lastPressedButton = null;

	ws.onmessage = (event) => {
		const receivedData = event.data;
		try {
			const parsedMessage = JSON.parse(receivedData);
			if (parsedMessage.state) {
				console.log(`Received updated poll state: ${parsedMessage.state}`);
				handlePollStateChange(parsedMessage.state);
			}
			if (parsedMessage.pollOptions) {
				handlePollOptions(parsedMessage.pollOptions);
			}
		} catch (error) {
			console.error("Error parsing message:", error);
		}
	};

	buttonsContainer.addEventListener("click", (event) => {
		const button = event.target;
		if (button.tagName === "BUTTON" && button.classList.contains("active")) {
			if (lastPressedButton) {
				lastPressedButton.classList.remove("lastPressed");
			}
			button.classList.add("lastPressed");
			lastPressedButton = button;
		}
	});

	function handlePollStateChange(pollState) {
		switch (pollState) {
			case PollStates.AWAITING_POLL:
				resetButtons();
				break;
			case PollStates.IN_PROGRESS:
				activateButtons();
				break;
			case PollStates.POLL_CLOSED:
				deactivateButtons();
				break;
			default:
				console.warn(`Unknown poll state: ${pollState}`);
		}
	}

	function handlePollOptions(pollOptions) {
		buttons.forEach((button, i) => {
			const option = pollOptions[`option${i + 1}`];
			button.innerHTML = option ? formatButtonLabel(option) : `innerHTML ${i + 1}`;
		});
	}

	function resetButtons() {
		buttons.forEach((button, index) => {
			button.classList.remove("active", "lastPressed");
			button.disabled = true;
			if (index === 0) {
				button.innerHTML = "APG";
			} else if (index === 1) {
				button.innerHTML = "Currently no poll";
			} else {
				button.innerHTML = "";
			}
		});
	}

	function activateButtons() {
		buttons.forEach((button) => {
			button.classList.add("active");
			button.disabled = false;
		});
	}

	function deactivateButtons() {
		buttons.forEach((button) => {
			button.classList.remove("active");
			button.disabled = true;
			if (button.classList.contains("lastPressed")) {
				sendMessageToServer(page, convertBack(button.innerHTML), ws);
			}
			button.classList.remove("lastPressed");
		});
	}

	function formatButtonLabel(option) {
		const optionName = Object.keys(option)[0];
		const formattedOptionName = convertToTitleCase(optionName);
		const formattedOptionValue = formatOptionValue(option[optionName]);
		return `${formattedOptionName} ${formattedOptionValue}`;
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

	function convertBack(input) {
		const words = input.split(' ').filter(word => word.trim() !== '');
		if (words.length === 0) return '';

		let firstWord = words[0].toLowerCase().replace(/\+$/, '');
		let changeType = determineChangeType(words[words.length - 1]);

		for (let i = 1; i < words.length - 1; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].substring(1);
		}

		const otherWords = words.slice(1, -1).join('');
		const jsonObject = { [`${firstWord}${otherWords}`]: changeType };
		return jsonObject;
	}

	function determineChangeType(lastWord) {
		if (lastWord.endsWith('++')) return "increasePlus";
		if (lastWord.endsWith('+')) return "increase";
		if (lastWord.endsWith('--')) return "decreasePlus";
		if (lastWord.endsWith('-')) return "decrease";
		return "";
	}
});
