import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
import {FileUploadWithPreview} from "https://unpkg.com/file-upload-with-preview/dist/index.js";

// *FileUploadWithPreview
const upload = new FileUploadWithPreview("upload-image", {
  multiple: true,
  maxFileCount: 6,
  
});
// * end FileUploadWithPreview

//* CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat-box .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray || [];
    if (content || images.length > 0) {
      // Gửi ảnh hoặc content lên server
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
//* end CLIENT_SEND_MESSAGE

//* SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat-box .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const boxTyping = document.querySelector(".chat-box .inner-list-typing");
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";
  const div = document.createElement("div");
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }
  if(data.content){
    htmlContent = `
      <div class="inner-content">${data.content}</div>
    `;
  }
  if(data.images) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `<img src="${image}">`
    }
    htmlImages+= "</div>";
  }
  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;
  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
});
//* end SERVER_RETURN_MESSAGE

//*scroll chat to bottom
const bodyChat = document.querySelector(".chat-box .inner-body");

if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//*end scroll chat to bottom

//*show typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
//*end show typing

//* emoji-picker
// document.querySelector("emoji-picker").addEventListener("emoji-click", event => console.log(event.detail))
//*show popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
//*insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const input = document.querySelector(
    ".chat-box .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    input.value += icon;
    const end = input.value.length;
    input.setSelectionRange(end, end);
    input.focus();
    showTyping();
  });

  input.addEventListener("keyup", () => {
    showTyping();
  });
}

//* end emoji-picker

//* server return typing
const elementsListTyping = document.querySelector(
  ".chat-box .inner-list-typing"
);
socket.on("SERVER_RETURN_TYPING", (data) => {
  if (data.type == "show") {
    const existTyping = elementsListTyping.querySelector(
      `[user-id="${data.userId}"]`
    );
    if (!existTyping) {
      const bodyChat = document.querySelector(".chat-box .inner-body");
      const boxTyping = document.createElement("div");
      boxTyping.classList.add("box-typing");
      boxTyping.setAttribute("user-id", data.userId);
      boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      elementsListTyping.appendChild(boxTyping);
      bodyChat.scrollTop = bodyChat.scrollHeight;
    }
  } else {
    const boxTypingRemove = elementsListTyping.querySelector(
      `[user-id="${data.userId}"]`
    );
    if (boxTypingRemove) {
      elementsListTyping.removeChild(boxTypingRemove);
    }
  }
});
//* end server return typing
