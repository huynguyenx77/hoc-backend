const mongoose = require("mongoose");
const generate = require("../helpers/genarate");
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default: generate.generateRamdomString(20),
  },
  phone: String,
  avatar: String,
  friendList: [
    {
      user_id: String,
      room_chat_id: String,
    }
  ],
  acceptFriend: Array, //lưu danh sách ai muốn kb
  requestFriend: Array, //lưu danh sách muốn kb
  status: {
    type: String,
    default: "active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
},{
  timestamps: true,
});

const Users = mongoose.model("Users", userSchema, "users");

module.exports = Users;
