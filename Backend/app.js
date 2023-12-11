const express = require("express");
const cors = require("cors");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});


app.use(express.json());
app.use(cors());

require("./src/routes/index.js")(app);

const PORT = 5000;

io.on("connect", (socket) => {
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
  res.send("Not Found");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;