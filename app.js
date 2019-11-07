// getting the requirements
const express = require('express');
const http = require('http');
const socket = require('socket.io');
const axios = require('axios');

const port = 4000;
const index = require('./route/index');

// instatntiation of express
const app = express();
app.use(index);

const server = http.createServer(app);
// initializing a new instance by passing the server object
const io = socket(server);


// The on() method takes 2 arguements: name of event and a callback.
// name of our event => "connection"
// the callback is executed after every connection event
io.on("connection", socket => { //connection event returns a socket object which is passed to the callback function
    // using the socket allows sending data back to client in real time.
    console.log("New Client connected"), setInterval(
        () => getApiAndEmit(socket), 
        10000 // the data is received after every 10 seconds
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
    // listening for the disconnect event.
    // It will be fired as soon as the client disconnects from the server and print a message to the console.
});

// The above code snippet is flawed
// It creates a new interval for every connected client
// While Socket.IO was born to handle many concurrent connections our example assumes that only one user will visit the page: you.
// If you were to put that code in production, just don’t

//...........MORE ACCURATE USE OF SOCKET.IO.................//
// let interval;

// io.on("connection", socket => {
//     console.log("New Client connected");
//     if (interval) {
//         clearInterval(interval);
//     }
//     interval = setInterval(() => getApiAndEmit(socket), 10000);
//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//     });
// });
//..........DONE............//

const getApiAndEmit = async socket => { //takes in socket as an arguement
    // the socket is just a communication channel between the client and the server
    // we can write whatever we want inside
    try {
        const res = await axios.get("api endpoint"); // makes a HTTP request to the API
        socket.emit("From the API", res.data); // Emits message "From the API" which contains our data
        // the emitted message can be intercepted by the Socket.io client 
    } catch (error) {
        return res.json(error)
        console.error(`Error: ${error.code}`);
    }
};

server.listen(port, () => console.log(`Listening on port ${port}`));