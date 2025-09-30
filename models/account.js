const mongoose = require("mongoose");
const generate = require("../helpers/genarate");
const accountSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  token: {
    type: String,
    default: generate.generateRamdomString(20),
  },
  phone: String,
  avatar: String,
  role_id : String,
  status: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
},{
  timestamps: true,
});

const Acounts = mongoose.model("Acounts", accountSchema, "accounts");

module.exports = Acounts;
