const mongoose = require("mongoose");
const roomChatSchema = new mongoose.Schema({
  user_id: String,
  room_chat_id: String,
  content: String,
  images: Array,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date
},{
  timestamps: true,
});

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;
