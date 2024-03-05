const webSocket = require('ws');
const express = require("express");
const expressServer = express();
const port = 3000;

let unique_code = null;
let pollState = "awaitingPoll"; // initial poll state
let pollTimer;
const pollDuration = 15000;
const pollResultTime = 5000;
let pollAnswers = [];

expressServer.use(express.static("Website"));

const websocketServer = new webSocket.Server({ noServer: true });

const readyServer = expressServer.listen(port, () => {
        console.log(`App listening on port ${port}`);
});

//https://community.render.com/t/can-i-use-express-and-websocket-on-same-service-node/8015
readyServer.on("upgrade", (req, socket, head) => {
        websocketServer.handleUpgrade(req, socket, head, (ws) => {
                websocketServer.emit("connection", ws, req);
        });
});

function updatePollState(newState) {
        console.log(`PollState updated to ${newState}`);
        if (newState === "inProgress") {
                startPollTimer();
        }
        pollState = newState;
        broadcastMessage("state", pollState);
}

function startPollTimer() {
        pollTimer = setTimeout(() => {
                updatePollState("pollClosed");
                pollTimer = setTimeout(() => {
                        updatePollState("awaitingPoll");
                        const favoriteAnswer = mode(pollAnswers);
                        broadcastMessage("pollResult", favoriteAnswer);
                        pollAnswers.length = 0;
                }, pollResultTime);
        }, pollDuration);
}

function resetPollTimer() {
        if (pollTimer) {
                clearTimeout(pollTimer);
        }
        startPollTimer();
}

function mode(array) {
        if (array.length == 0) {
                console.log("Error: Array is empty.");
                return null;
        }

        const modeMap = {};
        let maxEl = array[0];
        let maxCount = 1;

        for (let i = 0; i < array.length; i++) {
                const el = array[i];
                updateMode(el, modeMap, maxEl, maxCount);
        }

        console.log("Favorite answer:", maxEl);
        return maxEl;
}

function updateMode(el, modeMap, maxEl, maxCount) {
        modeMap[el] = (modeMap[el] == null) ? 1 : modeMap[el]++;

        if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
        }
}

function broadcastMessage(key, data) {
        const message = {};
        message[key] = data;

        const serializedMessage = JSON.stringify(message);

        websocketServer.clients.forEach((client) => {
                if (client.readyState === webSocket.OPEN) {
                        client.send(serializedMessage);
                }
        });
}

websocketServer.on("connection", (websocketConnection) => {
        websocketConnection.send(JSON.stringify({ state: pollState }));
        websocketConnection.on("message", (data) => {
                console.log("Data received: %o", data.toString());

                // Split the received data into page and data
                const [currentPage, receivedData] = data.toString().split(":");

                if (currentPage === "uniqueCode") {
                        // Set the unique_code variable to the received gameUniqueCode
                        unique_code = receivedData.toLowerCase();
                        console.log(`Game unique code updated: ${unique_code}`);
                }
                if (currentPage === "index") {
                        if (receivedData.toLowerCase() === unique_code) {
                                // Sending data back to the client
                                websocketConnection.send(JSON.stringify({ login: "correct" }));
                                console.log("login:correct");
                        } else {
                                // Sending data back to the client
                                websocketConnection.send(JSON.stringify({ login: "incorrect" }));
                                console.log("login:incorrect");
                        }
                }
                if (currentPage === "target") {
                        if (receivedData.toLowerCase() === "reached") {
                                updatePollState("inProgress");
                        }
                }
                if (currentPage === "vote") {
                        pollAnswers.push(receivedData);
                }
        });
});

// API endpoint to update poll state
expressServer.post('/update-poll-state/:newState', (req, res) => {
        const newState = req.params.newState;
        updatePollState(newState);
        resetPollTimer();
        res.send(`Poll state updated to ${newState}`);
});