

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
  console.log("User ID is " + userID)

  //  if user present in nres_chat.customer_list or 
  //  user successfully insert in nres_chat.customer_list 
  // i.e user register as customer then only allow to chat


  // try {
  //   const chatListResponse = await insertCustomerList(userID);
  //   console.log(chatListResponse)
  // } catch (error) {
  //   console.log(error)
  //   // this means user cannot insert because in customer table user is not register
  //   socket.send("User is not register as cutomer");
  //   socket.disconnect(true);
  //   return;
    
  // }

  //mapping user id to socket id;

  if (!userToSocket.has(userID)) {
     userToSocket.set(userID, new Set());
  }

  userToSocket.get(userID).add(socket.id);
  console.log(userToSocket)

// after user connect get all previous chats
  // try {
  //   const chat = await getSingleCustomerChat(userID);
  //   socket.emit("previousMessage",chat);
  // } catch (error) {
  //  // socket.send(error);
  // }

  socket.on("previousMessage",async function (){
    try {
      const chat = await getSingleCustomerChat(userID);
      socket.emit("previousMessage",chat);
    } catch (error) {
      //socket.send(error);
    }
  })


  socket.on("message", async function (payload) {
    //save all chats to database;
    console.log(payload);
    console.log("This is sender id - "+userID);
    let sender_id = userID;
    //nres - admin denoted as number 0 
    let receiver_id = sender_id == 0 ? payload.receiver_id : 0 ;
     
    let message = payload.message;
    console.log(sender_id,receiver_id,message)
    if(message.length ===0){
      return;
    }

    try {
      const response = await insertCustomerChat(
        sender_id,
        receiver_id,
        message
      );

      if (response.affectedRows !== 0) {
        // if receiver_id present in online User then  send message
     
        if (userToSocket.has(receiver_id.toString())) {
          //send to sender
          userToSocket.get(sender_id.toString()).forEach(function(socketID){
            userChat.to(socketID).emit("message",{ sender_id: sender_id,receiver_id:receiver_id,message: message , timestamp:new Date().toISOString()})
          })

          //send to receiver
          userToSocket.get(receiver_id.toString()).forEach(function (socketID) {
            userChat
              .to(socketID)
              .emit("message", { sender_id: sender_id, receiver_id:receiver_id,message: message ,timestamp:new Date().toISOString()});
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

const handleGetSingleCustomerChat = async function (req,res){

    const {customerID} = req.params;

    try {
      const data =await getSingleCustomerChat(customerID);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json("Internal Error");
    }

}

module.exports = { handleUserChat,handleGetCustomerChatList,handleGetSingleCustomerChat };
