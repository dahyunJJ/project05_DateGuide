const btnSend = document.querySelector("#btnSendMessage");
const chatMessage = document.querySelector(".chat_message");
const place = document.querySelector("#place");
const concept = document.querySelector("#concept");
const chatCon = document.querySelector(".chat_con");
const guideChat = document.querySelector(".guide_chat");
const loder = document.querySelector(".loder");
const restart = document.querySelector(".restart");
const chatInputDiv = document.querySelector(".chat-input");

chatInputDiv.style.display = "none";
chatCon.style.display = "none";
loder.style.display = "none";
restart.style.display = "none";
place.focus();

let userMessages = [];
let assistantMessages = [];

const sendMessage = async () => {
  guideChat.style.display = "none";
  loder.style.display = "block";
  chatInputDiv.style.display = "flex";

  // value값 서버에 보내기(json 형태로 전송)
  let myPlace = place.value;
  let myConcept = concept.value;

  // chatting
  const chatInput = document.querySelector(".chat-input input");
  const chatMessageDiv = document.createElement("div");
  chatMessageDiv.classList.add("chat_message");
  if (chatInput.value !== "") {
    chatMessageDiv.innerHTML = `<p>${chatInput.value}</p>`;
  } else {
    chatMessageDiv.innerHTML = `<p hidden>${chatInput.value}</p>`;
  }
  chatCon.appendChild(chatMessageDiv);

  userMessages.push(chatInput.value);
  chatInput.value = "";

  //
  const response = await fetch(
    "https://wkrhlz7zzk.execute-api.ap-northeast-2.amazonaws.com/props/guide",
    // "http://localhost:3000/guide",
    {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        myPlace: myPlace,
        myConcept: myConcept,
        userMessages: userMessages,
        assistantMessages: assistantMessages,
      }),
    }
  );

  const data = await response.json();
  assistantMessages.push(data.assistant);
  const astrologerMessage = document.createElement("div");
  astrologerMessage.classList.add("chat_message");
  astrologerMessage.innerHTML = `<p class="assistant">${data.assistant.replace(
    /\n/g,
    "<br />"
  )}</p>`;
  chatCon.appendChild(astrologerMessage);

  chatCon.style.display = "block";
  chatCon.scrollTop = chatCon.scrollHeight;
  loder.style.display = "none";
  restart.style.display = "block";
};

const reStart = () => {
  window.location.reload();
};
btnSend.addEventListener("click", sendMessage);
document.querySelector("#btn").addEventListener("click", sendMessage);
restart.addEventListener("click", reStart);
