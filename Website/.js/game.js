// Define the PollStates enum
const PollStates = {
	AWAITING_POLL: "awaitingPoll",
	IN_PROGRESS: "inProgress",
	POLL_CLOSED: "pollClosed",
};

window.addEventListener("load", () => {
	const page = "vote";
	const buttons = document.querySelectorAll("button");

	let lastPressedButton = null;

	ws.onmessage = (event) => {
		const receivedData = event.data;
		try {
			const parsedMessage = JSON.parse(receivedData);
			if (!parsedMessage.state && !parsedMessage.pollOptions) {
				console.log("Message wasn't for us.");
				return;
			}
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
						sendMessageToServer(page, convertBack(button.innerHTML), ws);
					}
					button.classList.remove("lastPressed");
				});
				break;
			default:
				console.warn(`Unknown poll state: ${pollState}`);
		}
	}

	function handlePollOptions(pollOptions) {
		for (let i = 0; i < buttons.length; i++) {
			const option = pollOptions[`option${i + 1}`];
			if (option) {
				const optionName = Object.keys(option)[0];
				const formattedOptionName = convertToTitleCase(optionName);
				const formattedOptionValue = formatOptionValue(option[optionName]);
				buttons[i].innerHTML = `${formattedOptionName} ${formattedOptionValue}`;
			} else {
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

	function convertBack(input) {
		const words = input.split(' ').filter(word => word.trim() !== '');

		if (words.length === 0) {
			return '';
		}
		let firstWord = words[0].toLowerCase().replace(/\+$/, '');

		let changeType = "";
		if (words[words.length - 1].endsWith('+')) {
			changeType = "increase";
			if (words[words.length - 1].endsWith('++')) {
				changeType += "Plus";
			}
		} else if (words[words.length - 1].endsWith('-')) {
			changeType = "decrease";
			if (words[words.length - 1].endsWith('--')) {
				changeType += "Plus";
			}
		}

		for (let i = 1; i < words.length - 1; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].substring(1);
		}

		const otherWords = words.slice(1, -1).join('');

		const jsonObject = {};
		jsonObject[`${firstWord}${otherWords}`] = changeType;

		return jsonObject;
	}
});
