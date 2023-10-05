const { insertCustomerChat, getSingleCustomerChat, getCustomerChatList, findOrCreateCustomerChatList } = require("../../models/services/chat/service.customerChat");
const fs = require('fs');
const path = require('path');


const {UploadImage} = require("../../middlewares/middleware.uploadFile");
const { findUserByEmail, findUserByID } = require("../../models/services/users/service.user");
const { handleLimitOffset, handleErrorResponse } = require("../controller.utils");

const upload = new UploadImage("uploads/chat/customer", 2 * 1024 * 1024).upload.array('image',5);


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
      const customerResponse = await findUserByID({user_id:userID,user_type:"customer"},['user_id','name'])
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

  //after user connect get all previous chats
  // try {
  //   const chat = await getSingleCustomerChat(userID);
  //   socket.emit("previousMessage",chat);
  // } catch (error) {
  //  // socket.send(error);
  // }

  // socket.on("previousMessage", async function () {
  //   try {
  //     const chat = await getSingleCustomerChat(userID);
  //     console.log("previous message",chat)
  //     socket.emit("previousMessage", chat);
  //   } catch (error) {
  //     //socket.send(error);
  //   }
  // });

  socket.on("message", async function (payload) {
    //save all chats to database;

    console.log(payload);
    console.log("This is sender id - " + userID);
    let sender_id = userID;
    //nres - admin denoted as number 0 - sender-id may string
    let receiver_id = sender_id == 0 ? payload.receiver_id : 0;

    let message = payload.message;
    if (!message || message.trim().length === 0) {
      return;  // Exit if the message is empty
    }
    console.log(sender_id, receiver_id, message);
    let imageUrl = null;

    // Check if there's an image in the payload
    if(payload.image) {
      try {
        const imageBuffer = Buffer.from(payload.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const tempFileName = Date.now() + '.png';
        const tempFilePath = path.join(__dirname, 'uploads', tempFileName);
        fs.writeFileSync(tempFilePath, imageBuffer);

        // Use Multer to move the image to its final destination
        const mockReq = {
            body: {},
            file: {
                fieldname: 'image',
                originalname: tempFileName,
                encoding: '7bit',
                mimetype: 'image/png',
                buffer: imageBuffer,
                size: imageBuffer.length
            }
        };
        const mockRes = {};
        await new Promise((resolve, reject) => {
            upload(mockReq, mockRes, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                imageUrl = `/uploads/${mockReq.file.filename}`;
                resolve();
            });
        });
    } catch (error) {
        console.error('Error processing image', error);
        // Inform the client of the error
        socket.send("Error processing the image");
        return;  // Exit if there's an error
    }
  }
  

    try {
      const response = await insertCustomerChat(
        sender_id,
        receiver_id,
        message,
         
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
              imageUrl:imageUrl,
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
                imageUrl:imageUrl,
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

const handleGetSingleCustomerChat = async function (req, res) {
  const { customer_id } = req.params;
  try {
    const data = await getSingleCustomerChat(customer_id);

    return res.status(200).json(data);
  } catch (error) {
    handleErrorResponse(res,error)
  }
};

module.exports = {
  handleUserChat,
  handleGetCustomerChatList,
  handleGetSingleCustomerChat,
};
