const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const routes = require("./src/routes/index.js");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(cors({ origin: "*" }));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", (interval) => {
    console.log("Client disconnected");
    clearInterval(interval);
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

app.use("*", (req, res) => {
  res.send("not found");
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;