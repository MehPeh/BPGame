// Connect to WebSocket
const WebSocket = require('ws')

const wss = new WebSocket.Server({port:8080},()=>{
        console.log('Server started!')
})

const expectedData = "5050"

wss.on('connection',(ws)=>{
        ws.on('message',(data)=>{
                console.log('data received %o', data.toString())

                if (data.toString() === expectedData) {
                        // Perform any additional processing if needed

                        // Sending data back to the client
                        ws.send("Data received successfully - Website");
                        console.log("Data received succesfully - Server");
                } else {
                        ws.send("Received data does not match the expected data. - Website");
                        console.log("Received data does not match the expected data. - Server");
                }
        })
})

wss.on('listening',()=>{
        console.log('Server is listening on port 8080')
})