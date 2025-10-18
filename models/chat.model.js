const mongoose = require("mongoose");
const generate = require("../helpers/genarate");
const chatSchema = new mongoose.Schema({
  user_id: String,
  room_chat_id: String,
  content: String,
  images: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date
},{
  timestamps: true,
});

const Chats = mongoose.model("Chats", chatSchema, "chats");

module.exports = Chats;
