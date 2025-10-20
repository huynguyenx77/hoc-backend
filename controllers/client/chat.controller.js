const Chat = require("../../models/chat.model");
const User = require("../../models/user.models");
const upload = require("../../helpers/uploadCloudinary");

const socketIO = require("../../sockets/client/chat.socket");
//* [GET] /search
module.exports.index = async (req, res) => {
  // socketIO
  socketIO.chat(res)
  // end socketIO

  // Lấy ra data
  const chats = await Chat.find({
    deleted: false,
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.infoUser = infoUser;
  }
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
