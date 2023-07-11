const { handleUserChat } = require("../controllers/chat/controller.userChat");


const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const chatServer = function() {
  let adminChat = io.of("/admin");
  let userChat = io.of("/user");

  const userToSocket = {};
  const onlineUserID  = [];

  let onlineUser = 0;


  userChat.on("connection", (socket)=>{handleUserChat(userChat,socket)});

  adminChat.on("connection", function (socket) {
    onlineUser++;
    console.log(`Total Online User ${onlineUser}`);

    socket.send("Welcome To chat Bro ");

    socket.broadcast.emit("broadcast", `Total Online User ${onlineUser}`);

    socket.on("message", function (payload) {
      console.log("Message Receive From Users");
      console.log(payload);
      socket.emit("message", {
        message: "From Admin",
        name: "Nepal real state ",
      });
    });

    socket.on("disconnect", function () {
      console.log("User Disconnected From Chat");
      onlineUser--;
      console.log(onlineUser);
    });
  });

  const startServer = () => {
    server.listen(5000, () => {
      console.log('Chat server running on port 5000');
    });
  };

  //return server=()=>{server.listen(5000,()=>console.log("chat server running on port 5000"))};

  return {
    startServer
  };
}

module.exports = { chatServer };
