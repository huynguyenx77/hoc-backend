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
