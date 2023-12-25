const express = require("express");
const cors = require("cors");
const app = express();

const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

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

app.use(express.json());
app.use(cors());

require("./src/routes/index.js")(app);

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

app.use("*", (req, res) => {
  res.send("not found");
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;