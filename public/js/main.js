socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

let fromUser = localStorage.getItem("from");
let toUser = localStorage.getItem("to");
//socket.emit('userDetails',{fromUser,toUser});

function storeDetails() {
 
  fromUser = document.getElementById("from").value;
  toUser = document.getElementById("to").value==""?localStorage.getItem("to"): document.getElementById("to").value;
  if(toUser)
  {
    localStorage.removeItem("from");
    localStorage.removeItem("to");
  localStorage.setItem("from", fromUser);
  localStorage.setItem("to", toUser);
  element = document.querySelectorAll(".chat-messages");
  socket.emit("userDetails", { fromUser, toUser }); //emits details of established chat
  // socket.emit('userDetails',{fromUser,ChatRoom});
  }
}
// setInterval(() => {
//   storeDetails();
// }, 2000);

function storeTo() {
  //console.log(toUser);
}

//Submit message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Prevents default logging to a file
  const msg = e.target.elements.msg.value;
  final = {
    fromUser: fromUser,
    to: toUser,
    msg: msg,
  };
  socket.emit("chatMessage", final); //emits chat message along with sender and reciever to server
  document.getElementById("msg").value = " ";
});

socket.on("output", (data) => {
  console.log(data);
});

socket.on("output", (data) => {
  //recieves the entire chat history upon logging in between two users and displays them
  document.querySelector(".chat-messages").innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    outputMessage(data[i]);
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("message", (data) => {
  //recieves a message and displays it
  outputMessage(data);
  console.log(data);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputMessage(message) {

  const div = document.createElement("div");
  // div.innerHTML = `<p class="meta">${message.from}<span> ${message.time}, ${message.date}</span></p>
  //   <p class ="text">
  //       ${message.message}
  //   </p>`;
  if(message.from == fromUser)
  {
   div.innerHTML = `
   <div class="message sent">
   ${message.message}
   <span class="metadata"> <span class="time"> ${message.time}, ${message.date}</span></span>
    </div>
   `;
  }
  else{
    div.innerHTML = `
    <div class="message received">
    ${message.message}
    <span class="metadata">${message.from} <span class="time"> ${message.time}, ${message.date}</span></span>
  </div>
    `;
  }
  document.querySelector(".chat-messages").appendChild(div);
}

socket.on("userList", (data) => {
  showdropdown(data)
});
function showdropdown(data) {
    document.getElementById('to').innerHTML="";
  var dropdown=`<option value="">select user</option>`
  console.log(data);
  data.forEach(e => {
    if(e.username!==document.getElementById("from").value){
      dropdown+=`<option value="${e.username}">${e.username}</option>`
    }
  })
  document.getElementById('to').innerHTML=dropdown

}
