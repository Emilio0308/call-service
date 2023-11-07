const RoomModel = require("./models/room.model");

let socketRoom;

const users = [];

const disconnectUserFromDBRoom = async (roomId, userId) => {
  // console.log(roomId);
  const meetRoom = await RoomModel.findOne({
    id: roomId,
  });

  if (meetRoom) {
    meetRoom.isActive.forEach((user) => {
      if (user.id == userId) {
        user.isActive = false;
      }
    });
    await meetRoom.save();
  }

  console.log(meetRoom);
};

exports.socketsEvents = (io) => {
  io.on("connection", async (socket) => {
    console.log("user connected to the socket", socket.id);

    socket.on("disconnect", () => {
      console.log("usuario desconectado");
    });

    socket.on("disconnecting", async () => {
      const rooms = socket.rooms;
      const arrayRooms = Array.from(rooms);
      arrayRooms.forEach(async (room) => {
        console.log("me falta id del usuario ptmr");
      });
    });

    socket.on("room", (room) => {
      io.emit("room", room);
    });

    socket.on("leave-room", async ({ roomId, userId, contactId }) => {
      console.log(roomId, userId, contactId);
      socketRoom = roomId;
      await disconnectUserFromDBRoom(socketRoom, userId);
      socket.leave(socketRoom);
    });

    socket.on("join", async ({ roomId, userId, contactId }, callback) => {
      const participants = [userId, contactId];
      const createdRoom = await RoomModel.findOne({
        participants: {
          $all: participants,
        },
      });

      if (!createdRoom) {
        const user1 = {
          id: userId,
          isActive: true,
        };
        const user2 = {
          id: contactId,
          isActive: false,
        };
        const newRoom = new RoomModel({
          participants: [userId, contactId],
          isActive: [user1, user2],
        });

        await newRoom.save();
        socketRoom = newRoom.id;
        callback(newRoom);
        socket.to(socketRoom).emit("active-room", newRoom);
      }
      if (createdRoom) {
        createdRoom.isActive.forEach((user) => {
          if (user.id == userId) {
            user.isActive = true;
          }
        });
        await createdRoom.save();
        callback(createdRoom);
        socketRoom = createdRoom.id;
        socket.to(socketRoom).emit("active-room", createdRoom);
      }
      socket.join(socketRoom);
      socket.to(socketRoom).emit("join", socketRoom);
    });

    socket.on("offer", (offer) => {
      // console.log("evento offer: ", socket.id, offer);
      socket.to(socketRoom).emit("offer", offer);
    });

    socket.on("answer", (answer) => {
      //   console.log("evento answer: ", socket.id, answer);
      socket.to(socketRoom).emit("answer", answer);
    });

    socket.on("candidate", (candidate) => {
      //   console.log("evento candidate: ", socket.id, candidate);
      socket.to(socketRoom).emit("candidate", candidate);
    });
  });
};
