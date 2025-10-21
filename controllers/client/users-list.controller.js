const User = require("../../models/user.models");
//* [GET]/register
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.user.id;
  const users = await User.find({
    _id: { $ne: userId}, //trả về client list-user loại trừ mình
    status: "active",
    deleted: false,
  }).select("avatar fullName");
  console.log(users);
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
};