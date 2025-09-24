const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

let messages = [];


app.use(express.static("public")); 

// Main homepage route
app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/public/html.html"); 
});

// Chat page route
app.get("/chat", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ultimate Chat</title>
      <style>
       
      </style>
    </head>
    <body>
      <div id="chat">
        <div id="usernameDisplay"></div>
        <div id="messages"></div>
        <form id="form">
          <input id="input" autocomplete="off" placeholder="Type a message..." />
          <button id="send">Send</button>
          <button type="button" id="changeName">Change Name</button>
        </form>
      </div>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        
      </script>
    </body>
    </html>
  `);
});

// Socket.io logic 
io.on("connection", (socket) => {
  socket.emit("loadMessages", messages);

  socket.on("join", (username) => {
    console.log(username + " joined");
  });

  socket.on("chat message", (msg) => {
    messages.push(msg);
    io.emit("chat message", msg);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

io.on("connection", (socket) => {

  // Send old messages
  socket.emit("loadMessages", messages);

  // Handle join
  socket.on("join", (username) => {
    console.log(username + " joined");

    // Send a system message to everyone
    const systemMsg = { user: "System", text: username + " has joined the chat.", system: true };
    messages.push(systemMsg); // save in messages array
    io.emit("chat message", systemMsg); // broadcast to all
  });

  // Handle new messages
  socket.on("chat message", (msg) => {
    messages.push(msg);
    io.emit("chat message", msg);
  });
});

