const User = require("../../models/user.models");
const usersSocket = require("../../sockets/client/users.socket")
//* [GET]/users/not-friend
module.exports.notFriend = async (req, res) => {
  // *socket
  usersSocket.user(res);
  // *end socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  })
  const requestFriend = myUser.requestFriend;
  const acceptFriend = myUser.acceptFriend
  const users = await User.find({
    $and: [ //*cú pháp $and là kết hợp nhiều điều kiện
      {_id: { $ne: userId}},  //trả về client list-user loại trừ mình
      {_id: { $nin: requestFriend}}, // trả về nếu không nằm trong danh sách đã gửi kb
      {_id: { $nin: acceptFriend}} // trả về nếu không nằm trong danh sách gửi kb
    ],
    status: "active",
    deleted: false,
  }).select("avatar fullName");
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};