

const {
  getSingleCustomerChat,
  insertCustomerChat,
  insertCustomerList,
  getCustomerChatList,
} = require("../../models/chat/model.customerChat");

const userToSocket = new Map();

const handleUserChat = async function (userChat, socket) {


  console.log("User COnnected to user Chat");
  const userID = socket.handshake.query.sender_id;

  //  if user present in nres_chat.customer_list or 
  //  user successfully insert in nres_chat.customer_list 
  // i.e user register as customer then only allow to chat


  try {
    const chatListResponse = await insertCustomerList(userID);
    console.log(chatListResponse)
  } catch (error) {
    console.log(error)
    // this means user cannot insert because in customer table user is not register
    socket.send("User is not register as cutomer");
    socket.disconnect(true);
    return;
    
  }

  //mapping user id to socket id;

  if (!userToSocket.has(userID)) {
     userToSocket.set(userID, new Set());
  }

  userToSocket.get(userID).add(socket.id);

// after user connect get all previous chats
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



  socket.on("disconnect", function () {
   console.log("User disconnet");
   console.log("current user is "+ userID)
   userToSocket.delete(userID);
   console.log(userToSocket)
  })


};


const handleGetCustomerChatList = async function(req,res){

  try {
    const data = await getCustomerChatList();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json("Internal Error");
  }

}

module.exports = { handleUserChat,handleGetCustomerChatList };
