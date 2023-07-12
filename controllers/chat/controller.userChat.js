const { pool } = require("../../connection");
const { getSingleCustomerChat, insertCustomerChat } = require("../../models/chat/model.customerChat");





const userToSocket = {};
const onlineUserID  = [];







const handleUserChat = async function(userChat,socket) {

    console.log("User COnnected to user Chat");

    //mapping user id to socket id;
    const userID = socket.handshake.query.sender_id;
    if(!userToSocket[userID]){
      userToSocket[userID] = new Set();
    }
    userToSocket[userID].add(socket.id);

    //after user connected get all message to users
    try {
        const chat = await getSingleCustomerChat(userID);
        socket.send(chat);
    } catch (error) {
        socket.send(error)
    }
   
    
    socket.on("message", async function (payload) {
      //save all chats to database;
        console.log( payload)
       
      let sender_id = payload.sender_id
      let receiver_id = payload.receiver_id
      let message = payload.message
     
      try {
        const response = await insertCustomerChat(sender_id,receiver_id,message)

        if(response.affectedRows!==0){
            
            socket.send(payload);
        }
      } catch (error) {
        socket.send(error)
      }



      //send message to another user
     
    });

    userChat.emit(`Active Users - ${onlineUserID}`)


    socket.on("disconnect", function () {
      console.log("User Disconnected From Chat");
    });
  }


module.exports  = {handleUserChat}