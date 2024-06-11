const fs = require('fs');
const path = require('path');
const webSocket = require('ws');
const express = require("express");
const expressServer = express();
const port = 3000;

// Read configuration.json
const configPath = path.join(__dirname, '..', 'BPGame','Bachelor_Project', 'Assets', 'Scripts', 'configuration.json');
let config;

try {
        const configFile = fs.readFileSync(configPath);
        config = JSON.parse(configFile);
        console.log('Configuration loaded:', config);
} catch (error) {
        console.error('Error reading configuration file:', error);
}

const pollDuration = config.pollDuration;
const pollResultTime = config.pollResultTime;

let unique_code = null;
let pollState = "awaitingPoll"; // initial poll state
let pollTimer;
let pollAnswers = [];

expressServer.use(express.static("../BPGame"));

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
                [maxEl, maxCount] = updateMode(el, modeMap, maxEl, maxCount);
        }

        console.log("Favorite answer:", maxEl);
        return maxEl;
}

function updateMode(el, modeMap, maxEl, maxCount) {
        modeMap[el] = (modeMap[el] == null) ? 1 : modeMap[el] + 1;

        if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
        }
        return [maxEl, maxCount];
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

                let jsonData;
                try {
                        jsonData = JSON.parse(data);
                } catch (error) {
                        console.error("Invalid JSON received:", error);
                        websocketConnection.send(JSON.stringify({ error: "Invalid JSON format" }));
                        return;
                }
                if (jsonData.uniqueCode) {
                        unique_code = jsonData.uniqueCode.toLowerCase();
                        console.log(`Game unique code updated: ${unique_code}`);
                }
                if (jsonData.index) {
                        if (unique_code == null || unique_code == "null") {
                                websocketConnection.send(JSON.stringify({ login: "No Game in Progress" }));
                                console.log("login:No Game in Progress");
                                return;
                        } else if (jsonData.index.toLowerCase() === unique_code) {
                                websocketConnection.send(JSON.stringify({ login: "correct" }));
                                console.log("login:correct");
                        } else {
                                websocketConnection.send(JSON.stringify({ login: "incorrect" }));
                                console.log("login:incorrect");
                        }
                }
                if (jsonData.target) {
                        if (jsonData.target.toLowerCase() === "reached") {
                                updatePollState("inProgress");
                        }
                }
                if (jsonData.vote) {
                        pollAnswers.push(jsonData.vote);
                }
                if (jsonData.pollOptions) {
                        websocketServer.clients.forEach((client) => {
                                if (client.readyState === webSocket.OPEN) {
                                        client.send(JSON.stringify(jsonData));
                                }
                        });
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
