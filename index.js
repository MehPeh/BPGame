// Connect to WebSocket
const WebSocket = require('ws')

let unique_code = "50fa"

const wss = new WebSocket.Server({port:8080},()=>{
        console.log('Server started!')
})

wss.on('connection',(ws)=>{
        ws.on('message',(data)=>{
                console.log('Data received: %o', data.toString());

                // Split the received data into page and data
                const [currentPage, receivedData] = data.toString().split(':');
                
                if (currentPage === 'gameUniqueCode') {
                        // Set the unique_code variable to the received gameUniqueCode
                        unique_code = receivedData.toLowerCase();
                        console.log("Game unique code updated:", unique_code);
                } else if (currentPage === 'index') {
                        if (receivedData.toLowerCase() === unique_code){
                                // Sending data back to the client
                                ws.send("Data received successfully");
                                console.log("Data received successfully");
                        } else {
                                // Sending data back to the client
                                ws.send("Received data does not match the expected data.");
                                console.log("Received data does not match the expected data.");
                        }
                }
        })
})

wss.on('listening',()=>{
        console.log('Server is listening on port 8080')
})