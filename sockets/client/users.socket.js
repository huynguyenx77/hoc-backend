const User = require("../../models/user.models");
module.exports.user = async (res) => {
  _io.once("connection", (socket) => {
    //*Tính năng người dùng gửi lời mời kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId); //id của mình
      // console.log(userId); // id của đối phương

      //* Thêm id của ông A vào acceptFriend của B
      const existUserAinB = await User.findOne({
        _id: userId,
        acceptFriend: myUserId,
      });

      if (!existUserAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriend: myUserId },
          }
        );
      }
      //* Thêm id của ông B vào requestFriend của A
      const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriend: userId,
      });

      if (!existUserBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriend: userId },
          }
        );
      }
    });

    //*Tính năng người dùng hết lời mời kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      // console.log(myUserId); //id của mình
      // console.log(userId); // id của đối phương

      //* Xóa id của ông A vào acceptFriend của B
      const existUserAinB = await User.findOne({
        _id: userId,
        acceptFriend: myUserId,
      });

      if (existUserAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriend: myUserId },
          }
        );
      }
      //* Thêm id của ông B vào requestFriend của A
      const existUserBinA = await User.findOne({
        _id: myUserId,
        requestFriend: userId,
      });

      if (existUserBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriend: userId },
          }
        );
      }
    });

  });
};
