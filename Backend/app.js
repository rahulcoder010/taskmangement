const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(cors());
app.use("*", (req, res) => {
  res.send("not found");
});

require("./src/routes/index.js")(app);

const PORT = 5000;

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", (interval) => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
  
  socket.on("addTask", (data) => {
    io.sockets.emit("addTask", data);
  });
  
  socket.on("updateTask", (data) => {
    io.sockets.emit("updateTask", data);
  });
  
  socket.on("deleteTask", (data) => {
    io.sockets.emit("deleteTask", data);
  });
});

app.use((req, res) => {
  if (req?.mainData?.method === "addTask") {
    io.sockets.emit("addTask", req.mainData.data);
  } else if (req?.mainData?.method === "updateTask") {
    io.sockets.emit("updateTask", req.mainData.data);
  } else if (req?.mainData?.method === "deleteTask") {
    io.sockets.emit("deleteTask", req.mainData.data);
  }
  res.json({
    ...req.mainData,
  });
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;