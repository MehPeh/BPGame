// Connect to WebSocket
const WebSocket = require('ws')

const express = require("express");
const expressServer = express();
const port = 3000;

let unique_code = "50fa"

expressServer.use(express.static("Website"));

const websocketServer = new WebSocket.Server({ noServer: true });

const readyServer = expressServer.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
});

//https://community.render.com/t/can-i-use-express-and-websocket-on-same-service-node/8015
readyServer.on("upgrade", (req, socket, head) => {
        websocketServer.handleUpgrade(req, socket, head, (ws) => {
                websocketServer.emit("connection", ws, req);
        });
});

websocketServer.on("connection", (websocketConnection) => {
        websocketConnection.on("message", (data) => {
                console.log("Data received: %o", data.toString());
      
                // Split the received data into page and data
                const [currentPage, receivedData] = data.toString().split(":");
      
                if (currentPage === "gameUniqueCode") {
                        // Set the unique_code variable to the received gameUniqueCode
                        unique_code = receivedData.toLowerCase();
                        console.log("Game unique code updated:", unique_code);
                } else if (currentPage === "index") {
                        if (receivedData.toLowerCase() === unique_code) {
                                // Sending data back to the client
                                websocketConnection.send("Data received successfully");
                                console.log("Data received successfully");
                        } else {
                                // Sending data back to the client
                                websocketConnection.send("Received data does not match the expected data.");
                                console.log("Received data does not match the expected data.");
                        }
                }
        });
});