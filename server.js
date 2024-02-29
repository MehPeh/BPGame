const webSocket = require('ws');
const express = require("express");
const expressServer = express();
const port = 3000;

let unique_code = null;
let pollState = "awaitingPoll"; // initial poll state
let pollTimer;
let pollDuration = 15000;
let pollResultTime = 5000;

expressServer.use(express.static("Website"));

const websocketServer = new webSocket.Server({ noServer: true });

const readyServer = expressServer.listen(port, () => {
        console.log(`App listening on port ${port}`);
});

//https://community.render.com/t/can-i-use-express-and-websocket-on-same-service-node/8015
readyServer.on("upgrade", (req, socket, head) => {
        websocketServer.handleUpgrade(req, socket, head, (ws) => {
                websocketServer.emit("connection", ws, req);

                // Send the current poll state to the new connection
                ws.send (JSON.stringify({pollState}));
        });
});

function updatePollState(newState) {
        if (newState === "inProgress") {
            // Start the poll timer only when the state changes to "inProgress"
            startPollTimer();
        }

        pollState = newState;

        // Notify all connected clients about the updated poll state
        websocketServer.clients.forEach((client) => {
                if (client.readyState === webSocket.OPEN) {
                        client.send(JSON.stringify({ pollState }));
                }
        });
};

function startPollTimer() {
        pollTimer = setTimeout(() => {
                updatePollState("pollClosed");
                console.log("PollState updated to pollClosed");
                pollTimer = setTimeout(() => {
                        updatePollState("awaitingPoll");
                        console.log("PollState updated to awaitingPoll");
                }, pollResultTime);
        }, pollDuration);
};
    
function resetPollTimer() {
        if (pollTimer) {
                clearTimeout(pollTimer);
        }

        startPollTimer();
};

websocketServer.on("connection", (websocketConnection) => {
        websocketConnection.send(JSON.stringify({ pollState }));
        websocketConnection.on("message", (data) => {
                console.log("Data received: %o", data.toString());
      
                // Split the received data into page and data
                const [currentPage, receivedData] = data.toString().split(":");
      
                if (currentPage === "uniqueCode") {
                        // Set the unique_code variable to the received gameUniqueCode
                        unique_code = receivedData.toLowerCase();
                        console.log("Game unique code updated:", unique_code);
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
        });
});

// API endpoint to update poll state
expressServer.post('/update-poll-state/:newState', (req, res) => {
        const newState = req.params.newState;
        updatePollState(newState);
        resetPollTimer;
        res.send(`Poll state updated to ${newState}`);
});