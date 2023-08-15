const { handleAgentChat } = require("./controllers/chat/controller.agentChat");
const { handleStaffChat } = require("./controllers/chat/controller.staffChat");
const { handleUserChat } = require("./controllers/chat/controller.customerChat");
const { handleNotification } = require("./controllers/notification/controller.notification");
// const { getSingleCustomerChat, insertCustomerChat } = require("./models/chat/model.customerChat");




const app = require("express")();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});


const socketServer = {};
socketServer.chat = function() {
  let adminChat = io.of("/admin");
  let userChat = io.of("/user");
  let staffChat = io.of("/staff");
  let agentChat = io.of("/agent");





  userChat.on("connection", async function(socket){
    handleUserChat(userChat,socket)
  });

  staffChat.on("connection",async function (socket){
   handleStaffChat(staffChat,socket);
  })

  agentChat.on("connection",async function (socket){
    handleAgentChat(agentChat,socket)
  })

  

  const startServer = () => {
    server.listen(5000, () => {
      console.log('Chat server running on port 5000');
    });
  }; 

  return {
    startServer
  };
}




socketServer.notification = function (){
  let notification = io.of("/notification");

  notification.on("connection",async function(socket){
   
    handleNotification(notification,socket)

  })
}


socketServer.startServer =  () => {
  server.listen(5000, () => {
    console.log('Socket server running on port 5000');
  });
}; 


// const chatServer = function() {
//   let adminChat = io.of("/admin");
//   let userChat = io.of("/user");
//   let staffChat = io.of("/staff");
//   let agentChat = io.of("/agent");





//   userChat.on("connection", async function(socket){
//     handleUserChat(userChat,socket)
//   });

//   staffChat.on("connection",async function (socket){
//    handleStaffChat(staffChat,socket);
//   })

//   agentChat.on("connection",async function (socket){
//     handleAgentChat(agentChat,socket)
//   })

  

//   const startServer = () => {
//     server.listen(5000, () => {
//       console.log('Chat server running on port 5000');
//     });
//   }; 

//   // return server=()=>{server.listen(5000,()=>console.log("chat server running on port 5000"))};

//   return {
//     startServer
//   };
// }

// const notificationServer = function(){
//   let notification = io.of("/notification");
  
//   notification.on("connection",async function(socket){
//     console.log("Hello ! I am connected from ")

//   })
   
// }


module.exports = {  socketServer   };
