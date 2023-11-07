const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const roomSchema = new mongoose.Schema(
  {
    id: { type: String, default: () => uuid() },
    participants: [String],
    isActive: [
      (user1 = {
        id: String,
        isActive: { type: Boolean, default: false },
      }),
      (user2 = {
        id: String,
        isActive: { type: Boolean, default: false },
      }),
    ],
  },
  { timestamps: true }
);

// Creación del modelo 'Room' basado en el esquema
const Room = mongoose.model("room", roomSchema);

module.exports = Room;
