const {
  getSingleCustomerChat,
  insertCustomerChat,
} = require("../../models/chat/model.customerChat");

const userToSocket = new Map();
//const onlineUsers = [];

const handleUserChat = async function (userChat, socket) {
  console.log("User COnnected to user Chat");

  //mapping user id to socket id;
  const userID = socket.handshake.query.sender_id;

  if (!userToSocket[userID]) {
    userToSocket[userID] = new Set();
  }
  userToSocket[userID].add(socket.id);
  console.log(userToSocket);

  //after user connected get all message to users

  // if(!onlineUsers.some((user)=>user.userID == userID)){
  //   onlineUsers.push({userID,socketID:socket.id})
  // }
  // console.log(onlineUsers)

  try {
    const chat = await getSingleCustomerChat(userID);
    socket.send(chat);
  } catch (error) {
    socket.send(error);
  }

  socket.on("message", async function (payload) {
    //save all chats to database;
    console.log(payload);
    let sender_id = payload.sender_id;
    let receiver_id = payload.receiver_id;
    let message = payload.message;

    try {
      const response = await insertCustomerChat(
        sender_id,
        receiver_id,
        message
      );

      if (response.affectedRows !== 0) {
        // if receiver_id present in online User then  send message
        if (userToSocket[receiver_id]) {
          userToSocket[receiver_id].forEach(function (socketID) {
            userChat
              .to(socketID)
              .emit("message", { sender_id: sender_id, message: message });
          });
        }
      }
    } catch (error) {
      socket.send(error);
    }
  })

  //userChat.emit(`Active Users - ${onlineUserID}`)

  socket.on("disconnect", function () {
   console.log("User disconnet");
   console.log("current user is "+ userID)
   userToSocket.delete(userID);
  })


};

module.exports = { handleUserChat };
