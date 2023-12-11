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

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", (interval) => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

app.use((req, res) => {
  const { mainData } = req;
  
  if(mainData?.method === "addTask"){
    io.sockets.emit("addTask", mainData.data);
  }else if(mainData?.method === "updateTask"){
    io.sockets.emit("updateTask", mainData.data);
  }else if(mainData?.method === "deleteTask"){
    io.sockets.emit("deleteTask", mainData.data);
  }
  
  res.json({
    ...mainData,
  });
});

app.use("*", (req, res) => {
  res.send("not found");
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

module.exports = app;