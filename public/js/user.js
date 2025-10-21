//*Chức năng gửi lời mời kết bạn
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");

if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button =>{
    button.addEventListener("click", () =>{
      button.closest(".box-user").classList.add("add")
      const userId = button.getAttribute("btn-add-friend");
      console.log(userId);
      socket.emit("CLIENT_ADD_FRIEND", userId)
    })
  })
}
//*end Chức năng gửi lời mời kết bạn

//*Chức năng hủy gửi lời mời kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");

if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button =>{
    button.addEventListener("click", () =>{
      button.closest(".box-user").classList.remove("add") //* closest là lấy ra thẻ cha
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId)
    })
  })
}
//*end Chức năng hủy gửi lời mời kết bạn

//*Chức năng xóa mời kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");

if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach(button =>{
    button.addEventListener("click", () =>{
      button.closest(".box-user").classList.add("refuse") //* closest là lấy ra thẻ cha
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId)
    })
  })
}
//*end Chức năng xóa mời kết bạn
