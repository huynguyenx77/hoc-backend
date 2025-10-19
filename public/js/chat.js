import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
//* CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat-box .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;

    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  });
}
//* end CLIENT_SEND_MESSAGE

//* SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat-box .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  let htmlFullName = "";
  const div = document.createElement("div");
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});
//* end SERVER_RETURN_MESSAGE

//*scroll chat to bottom
const bodyChat = document.querySelector(".chat-box .inner-body")
if(bodyChat){
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//*end scroll chat to bottom


//* emoji-picker
// document.querySelector("emoji-picker").addEventListener("emoji-click", event => console.log(event.detail))
//*show popup
const buttonIcon = document.querySelector(".button-icon");
if(buttonIcon){
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () =>{
    tooltip.classList.toggle("shown");
  }
}
//*insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
  const input = document.querySelector(".chat-box .inner-form input[name='content']")
  emojiPicker.addEventListener("emoji-click", (event) =>{
    const icon = event.detail.unicode
    input.value += icon;
  })
}

//* end emoji-picker