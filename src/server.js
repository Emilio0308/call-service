const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const cors = require('cors');

app.use(cors());


app.use(express.static("public"));

const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.redirect("index.html");
});

app.use(router);

let socketRoom;

const users = [];

io.on("connection", (socket) => {
  console.log("user connected to the socket", socket.id);

  socket.on("room", (room) => {
    io.emit("room", room);
  });

  socket.on("join", ({ room, userid }) => {
    socketRoom = room;
    users.push({ room, userid });
    socket.join(room);

    const clients = io.sockets.adapter.rooms.get(room);
    if (clients) {
      const socketIds = Array.from(clients);
      console.log("evento join: ", room, socketIds);
    }

    socket.to(socketRoom).emit("join", room);
  });

  socket.on("offer", (offer) => {
    console.log("evento offer: ", socket.id, offer);
    socket.to(socketRoom).emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    console.log("evento answer: ", socket.id, answer);
    socket.to(socketRoom).emit("answer", answer);
  });

  socket.on("candidate", (candidate) => {
    console.log("evento candidate: ", socket.id, candidate);
    socket.to(socketRoom).emit("candidate", candidate);
  });
});

const PORT = process.env.PORT || 4000;

http.listen(PORT, () => {
  console.log("Server is listening: ", PORT);
});
