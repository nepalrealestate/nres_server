const { handleAgentChat } = require("./controllers/chat/controller.agentChat");
const { handleStaffChat } = require("./controllers/chat/controller.staffChat");
const { handleUserChat } = require("./controllers/chat/controller.customerChat");
const { handleNotification } = require("./controllers/notification/controller.notification");
const logger = require("./utils/errorLogging/logger");
// const { getSingleCustomerChat, insertCustomerChat } = require("./models/chat/model.customerChat");




// const app = require("express")();

// const server = require("http").createServer(app);

// const io = require("socket.io")(server, {
//   pingTimeOut: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });


const socketServer = {};
socketServer.chat = function(io) {
  //console.log("Chat Server Working")
  let adminChat = io.of("/api/chat/admin");
  let userChat = io.of("/api/chat/user");
  let staffChat = io.of("/api/chat/staff");
  let agentChat = io.of("/api/chat/agent");


  userChat.on("connection", async function(socket){
    handleUserChat(userChat,socket)
  });

  staffChat.on("connection",async function (socket){
   handleStaffChat(staffChat,socket);
  })

  agentChat.on("connection",async function (socket){
    handleAgentChat(agentChat,socket)
  })


  
  
}



module.exports = socketServer;
