const { insertCustomerChat, getSingleCustomerChat, getCustomerChatList, findOrCreateCustomerChatList } = require("../../models/services/chat/service.customerChat");

const { chatImageUpload} = require("../../middlewares/middleware.uploadFile");
const { findUserByEmail, findUserByID } = require("../../models/services/users/service.user");
const { handleLimitOffset, handleErrorResponse } = require("../controller.utils");


const userToSocket = new Map();

const handleUserChat = async function (userChat, socket) {
  console.log("User COnnected to user Chat");
  const userID = (socket.handshake.query.sender_id)
  console.log("User ID is " + userID);

  //  if user present in nres_chat.customer_list or
  //  user successfully insert in nres_chat.customer_list
  // i.e user register as customer then only allow to chat

  // NRES - ADMIN TREATED AS NUMBER 0
  if(Number(userID) !== 0){
    try {
      // find customer ;
      const customerResponse = await findUserByID("customer",userID,['user_id','name'])
      if(!customerResponse){
        socket.send("User Not Found");
        socket.disconnect(true)
      }
      const chatListResponse = await findOrCreateCustomerChatList(userID);
      console.log(chatListResponse)
    } catch (error) {
      console.log(error)
      // this means user cannot insert because in customer table user is not register
      socket.send("User is not register as customer");
      socket.disconnect(true);
      return;
    }
  }

  //mapping user id to socket id;

  if (!userToSocket.has(userID)) {
    userToSocket.set(userID, new Set());
  }

  userToSocket.get(userID).add(socket.id);
  console.log(userToSocket);

  socket.on("message", async function (payload) {
    //save all chats to database;

    console.log("This is sender id - " + userID);
    let sender_id = userID;
    //nres - admin denoted as number 0 - sender-id may string
    let receiver_id = sender_id == 0 ? payload.receiver_id : 0;

    let message = payload.message;
    console.log(payload)
    if ( !payload.image && (!message || message.trim().length === 0) ) {
      return;  // Exit if the message is empty
    }
    console.log(sender_id, receiver_id, message);
    let imageURL = null;

    // Check if there's an image in the payload

    if(payload.image) {
      try {
        imageURL = await chatImageUpload(payload.image,'uploads/chat/customer','2 * 1024 * 1024');
        console.log("Image URL",imageURL)
      } catch (error) {
        console.error('Error processing image', error);
      }
  }
  

    try {
      const response = await insertCustomerChat(
        sender_id,
        receiver_id,
        message,
        imageURL
         
      );
      console.log(response);
      

      if (response) {
        // if receiver_id present in online User then  send message
        //send to sender
        console.log("Iam sender")
        userToSocket.get(sender_id.toString()).forEach(function (socketID) {
          userChat.to(socketID).emit("message", {
              id:response.dataValues.id,
              sender_id:  Number(sender_id),
              receiver_id: Number(receiver_id),
              message: message,
              imageURL:imageURL,
              timestamp: new Date().toISOString(),
            });
        });
        if (userToSocket.has(receiver_id.toString())) {
          //send to receiver
          userToSocket.get(receiver_id.toString()).forEach(function (socketID) {
            userChat
              .to(socketID)
              .emit("message", {
                id:response.dataValues.id,
                sender_id: Number(sender_id),
                receiver_id: Number(receiver_id),
                message: message,
                imageURL:imageURL,
                timestamp: new Date().toISOString(),
              });
          });
        }
      }
    } catch (error) {
      socket.send(error);
    }
  });

  socket.on("disconnect", function () {
    console.log("User disconnet");
    console.log("current user is " + userID);
    userToSocket.delete(userID);
    console.log(userToSocket);
  });
};

const handleGetCustomerChatList = async function (req, res) {
  const [limit,offset] = handleLimitOffset(req)
  try {
    const data = await getCustomerChatList(limit,offset);
    //get all data and loop to get lastest chat only one
    return res.status(200).json(data);
  } catch (error) {
    handleErrorResponse(res,error)
  }
};

const handleGetSingleCustomerChatForAdmin = async function (req, res) {
  const { customer_id } = req.params;
  try {
    const data = await getSingleCustomerChat(customer_id);

    return res.status(200).json(data);
  } catch (error) {
    handleErrorResponse(res,error)
  }
};

const handleGetSingleCustomerChat = async function (req,res){
  const customer_id = req.id;
  try {
    const previousChat = await getSingleCustomerChat(customer_id);
    return res.status(200).json(previousChat);
  } catch (error) {
    handleErrorResponse(res,error)
  }
}

module.exports = {
  handleUserChat,
  handleGetCustomerChatList,
  handleGetSingleCustomerChat,
};
