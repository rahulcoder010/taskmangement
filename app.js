const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

require("./src/routes/index.js")(app);

const PORT = 5000;

const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (so) => {
  console.log("New client connected");

  so.on("disconnect", (interval) => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

app.use((req, res) => {
  if(req?.mainData?.method==="addTask"){
    io.sockets.emit("addTask", req.mainData.data);
  }else if(req?.mainData?.method==="updateTask"){
    io.sockets.emit("updateTask", req.mainData.data);
  }else if(req?.mainData?.method==="deleteTask"){
    io.sockets.emit("deleteTask", req.mainData.data);
  }
  res.json({
    ...req.mainData,
  });
});

app.use("*", (req, res) => {
  res.send("not found");
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;