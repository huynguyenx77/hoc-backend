//*Chức năng gửi lời mời kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");

if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
//*end Chức năng gửi lời mời kết bạn

//*Chức năng hủy gửi lời mời kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");

if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add"); //* closest là lấy ra thẻ cha
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
//*end Chức năng hủy gửi lời mời kết bạn

//*Chức năng xóa lời mời kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");

if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse"); //* closest là lấy ra thẻ cha
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
//*end Chức năng xóa lời mời kết bạn

//*Chức năng chấp nhận lời mời kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");

if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted"); //* closest là lấy ra thẻ cha
      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
//*end Chức năng chấp nhận lời mời kết bạn

//* SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUserAccept = document.querySelector("[badge-users-accept]");
  const userId = badgeUserAccept.getAttribute("badge-users-accept");

  if (userId == data.userId) {
    badgeUserAccept.innerHTML = data.lengthAcceptFriend;
  }
});
//*end SERVER_RETURN_LENGTH_ACCEPT_FRIEND

//* SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  //* Trang lời mời kết bạn
  const dataUserAccept = document.querySelector("[data-users-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-users-accept");
    if (userId == data.userId) {
      //* vẽ giao diện
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUser._id);
      newBoxUser.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="/images/avatar.webp" alt="${data.infoUser.fullName}">
          </div>
          <div class="inner-info">
            <div class="inner-name">${data.infoUser.fullName}</div>
            <div class="inner-button">
              <button 
                class="btn btn-sm btn-primary mr-1" 
                btn-accept-friend="${data.infoUser._id}"
              >
                Chấp nhận
              </button>
              <button 
                class="btn btn-sm btn-secondary mr-1" 
                btn-refuse-friend="${data.infoUser._id}"
              >
                Hủy
              </button>
              <button 
                class="btn btn-sm btn-secondary mr-1" 
                btn-deleted-friend="${data.infoUser._id}" 
                disabled="disabled"
              >
                Đã hủy
              </button>
              <button 
                class="btn btn-sm btn-primary mr-1" 
                btn-accepted-friend="68ebe86ce0144c77f2352bd6" 
                disabled="disabled"
              >
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `;
      dataUserAccept.appendChild(newBoxUser);
      //*end vẽ giao diện

      //* xóa lời mời kết bạn
      const btnRefuseFriend = document.querySelector("[btn-refuse-friend]");
      btnRefuseFriend.addEventListener("click", () => {
        btnRefuseFriend.closest(".box-user").classList.add("refuse"); //* closest là lấy ra thẻ cha
        const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_REFUSE_FRIEND", userId);
      }); //*end xóa lời mời kết bạn

      //*Chức năng chấp nhận lời mời kết bạn
      const btnAcceptFriend = document.querySelector("[btn-accept-friend]");
      btnAcceptFriend.addEventListener("click", () => {
        btnAcceptFriend.closest(".box-user").classList.add("accepted"); //* closest là lấy ra thẻ cha
        const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      }); //* end Chức năng chấp nhận lời mời kết bạn
    }
  }
  //* end Trang lời mời kết bạn

  //* Trang danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId == data.userId) {
      //* Xóa A khỏi danh sách của B
      const boxUserRemove = dataUserNotFriend.querySelector(
        `[user-id="${data.infoUser._id}"]`
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
  //*end Trang danh sách người dùng
});
//*end SERVER_RETURN_INFO_ACCEPT_FRIEND

//* SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const dataUserAccept = document.querySelector("[data-users-accept]");
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-users-accept");

    if (userId == data.userId) {
      //* Xóa A khỏi danh sách của B
      const boxUserRemove = dataUserAccept.querySelector(
        `[user-id="${data.userIdA}"]`
      );
      if (boxUserRemove) {
        dataUserAccept.removeChild(boxUserRemove);
      }
    }
  } else if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");

    if (userId == data.userId) {
      //* Xóa A khỏi danh sách của B
      const boxUserRemove = dataUserNotFriend.querySelector(
        `[user-id="${data.userIdA}"]`
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});
//*end SERVER_RETURN_USER_ID_CANCEL_FRIEND


