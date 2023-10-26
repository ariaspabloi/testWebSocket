const express = require("express");
const socket = require("socket.io");
const path = require("path");

// App setup
const PORT = process.env.PORT || 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
// Static files
app.use(express.static("public"));
// Socket setup
const io = socket(server);
const activeUsers = new Set();
let state = true;

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });
});

setInterval(() => {
  state = !state;
  io.emit("control", state);
}, 5000);

// GET route to send <link>index.html</link>
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
