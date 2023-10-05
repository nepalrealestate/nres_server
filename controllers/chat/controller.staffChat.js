// const {  insertStaffChatList, insertStaffChat, getStaffChatList, insertStaffGroup, deleteStaffFromGroup, getStaffFromGroupByID, insertStaffGroupChat } = require("../../models/chat/model.staffChat");

const { insertStaffChatList, getStaffFromGroupById, insertStaffChat, insertStaffGroupChat, getStaffChatList, getSingleStaffChat, insertStaffGroup, deleteStaffFromGroup } = require("../../models/services/chat/service.staffChat");
const { findAdmin, findAdminByID } = require("../../models/services/users/service.admin");

const userToSocket = new Map();

const handleStaffChat = async function (staffChat, socket) {

 

  console.log("Staff Connected To chat");
  const userID = socket.handshake.query.sender_id;

  //  if user present in nres_chat.staff_list or
  //  user successfully insert in nres_chat.customer_list
  // i.e user register as customer then only allow to chat

  try {
    //find staff/admin
    const adminResponse = await findAdminByID(userID);
    if(!adminResponse){
      socket.send("Admin Not Found");
      socket.disconnect(true)
    }
    const chatListResponse = await insertStaffChatList(userID);
    console.log(chatListResponse);
  } catch (error) {
    console.log(error);
    // this means user cannot insert because in customer table user is not register
    socket.send("User is not register as staff");
    socket.disconnect(true);
    return;
  }

  // if staff in group then join group chat
 
  if(Number(userID) !== 0){
    try {
      groupResponse = await getStaffFromGroupById(userID);
     console.log(" This is Group Response " + groupResponse?.staff_id)
      if(groupResponse?.staff_id === Number(userID)){
        socket.join("staffGroup");
        staffChat.in("staffGroup").emit("connectedRoom" , "You are connected to group");
        console.log("Staff Join in group")
     }
   } catch (error) {
     console.log(error);
   }
  }
  // 0 is represent NRES Super Admin 
  if(Number(userID) === 0){
    socket.join("staffGroup");
    staffChat.in("staffGroup").emit("connectedRoom" , "You are connected to group");
    console.log("Admin Join in group")

  
  }


  //mapping user id to socket id;

  if (!userToSocket.has(userID)) {
    userToSocket.set(userID, new Set());
  }

  userToSocket.get(userID).add(socket.id);
  console.log(userToSocket);

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
      const response = await insertStaffChat(
        sender_id,
        receiver_id,
        message
      );
     

      if (response.affectedRows !== 0) {
        // if receiver_id present in online User then  send message
            //send to sender
        userToSocket.get(sender_id.toString()).forEach(function(socketID){
          staffChat.to(socketID).emit("message",{ sender_id: sender_id,receiver_id:receiver_id,message: message , timestamp:new Date().toISOString()})
        })
        if (userToSocket.has(receiver_id.toString())) {
          //send to receiver
          userToSocket.get(receiver_id.toString()).forEach(function (socketID) {
            staffChat
              .to(socketID)
              .emit("message", { sender_id: sender_id, receiver_id:receiver_id,message: message ,timestamp:new Date().toISOString()});
          });
        }
      }
    } catch (error) {
      socket.send(error);
    }
  })

  // group message related

  socket.on("groupMessage",async function (room,payload){

    // for only one group
    if(room !== "staffGroup"){
      return;
    }

     //save all chats to database;
     console.log(payload);
     console.log("This is sender id - "+userID);
     let sender_id = userID;
    
     let message = payload.message;
     console.log(room,message)
     if(message.length === 0){
       return;
     }
 
     try {
       const response = await insertStaffGroupChat(sender_id,message);
 
       if (response.affectedRows !== 0) {
         // send message to room 
         console.log(socket.adapter.rooms)
       
          staffChat.to("staffGroup").emit("groupMessage",{sender_id:sender_id,message:message});
          console.log("Here is message send")
          console.log(socket.adapter.rooms.get("staffGroup"))
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



const handleGetStaffChatList = async function(req,res){

    try {
      const data = await getStaffChatList();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json("Internal Error");
    }
  
  }
  
  const handleGetSingleStaffChat = async function (req,res){
  
      const {staffID} = req.params;
  
      try {
        const data =await getSingleStaffChat(staffID);
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json("Internal Error");
      }
  
  }

const handleInsertStaffGroup = async function (req,res){
    const {staffID} = req.params;

    try {
        const response = await insertStaffGroup(staffID);
        if(response.affectedRows === 0){
            return res.status(400).json({message:"No staff Present"});
        }
        return res.status(200).json({message:"Staff added to group"});

    } catch (error) {
        return res.status(500).json({message:"Internal Error"});
    }


}

const handleDeleteStaffFromGroup = async function (req,res){
    const {staffID} = req.params;

    try {
        const response = await deleteStaffFromGroup(staffID);
        if(response.affectedRows === 0){
            return res.status(400).json({message:"No staff Present to remove"});
        }
        return res.status(200).json({message:"Staff deleted from group"});
    } catch (error) {
        return res.status(500).json({message:"Internal Error"});
    }
}



module.exports = { handleStaffChat , handleGetSingleStaffChat,handleGetStaffChatList ,handleInsertStaffGroup,handleDeleteStaffFromGroup};
