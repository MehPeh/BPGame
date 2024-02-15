// Connect to WebSocket
const WebSocket = require('ws')

// Import Firebase Admin SDK
const admin = require('firebase-admin'); 
const serviceAccount = require('./bachelor-project-kdg-firebase-adminsdk-u4wkn-68efd3766b.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bachelor-project-kdg-default-rtdb.europe-west1.firebasedatabase.app"
});

const wss = new WebSocket.Server({port:8080},()=>{
        console.log('Server started!')
})

wss.on('connection',(ws)=>{
        ws.on('message',(data)=>{
                console.log('data received %o', data.toString())
                
                // Use Firebase Admin SDK to interact with the Realtime Database
                const db = admin.database();
                const ref = db.ref('path/to/data'); // Replace with the actual path

                // Perform database interactions here
                // For example, reading, writing, or listening for changes

                ws.send(data) // Sending data back to the client
        })
})

wss.on('listening',()=>{
        console.log('server is listening on port 8080')
})

