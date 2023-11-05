// const express = require("express");
// const app = express();
// const fs = require("fs");
// const PORT = process.env.PORT || 3000;

// // paste your IP address of the local network
// // const HOST = "192.168.0.5";

// // specify the self-signed certificate for https connection
// const options = {
//   key: fs.readFileSync("key.pem"),
//   cert: fs.readFileSync("cert.pem")
// };
// const server = require("https").createServer(options, app);
// const io = require("socket.io")(server);

// app.use(express.static("public"));

// var socketRoom;

// io.on("connection", socket => {
//   console.log("user connected to the socket");

//   socket.on("room", room => {
//     io.emit("room", room);
//   });

//   socket.on("join", room => {
//     socketRoom = room;
//     socket.join(socketRoom);
//     socket.to(socketRoom).emit("join", room);
//   });

//   socket.on("offer", offer => {
//     socket.to(socketRoom).emit("offer", offer);
//   });

//   socket.on("answer", answer => {
//     socket.to(socketRoom).emit("answer", answer);
//   });

//   socket.on("candidate", candidate => {
//     socket.to(socketRoom).emit("candidate", candidate);
//   });
// });

// server.listen(PORT, () => {
//   console.log("Server is listening: ", PORT);
// });

const express = require("express");
const app = express();
const fs = require("fs");
const http = require("http").createServer(app); // Usamos http en lugar de https
const io = require("socket.io")(http);


app.use(express.static("public"));

const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.redirect("index.html");
});

app.use(router);

var socketRoom;

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
