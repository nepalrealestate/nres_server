const { handleStaffChat } = require("../controllers/chat/controller.staffChat");
const { handleUserChat } = require("../controllers/chat/controller.userChat");
const { getSingleCustomerChat, insertCustomerChat } = require("../models/chat/model.customerChat");


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
  let staffChat = io.of("/staff");




  userChat.on("connection", async function(socket){
    handleUserChat(userChat,socket)
  });

  staffChat.on("connection",async function (socket){
   handleStaffChat(userChat,socket);
  })

  

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
