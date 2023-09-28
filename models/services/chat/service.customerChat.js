
const db = require("../../model.index");
const CustomerChat = db.ChatModel.CustomerChat;
const CustomerChatList = db.ChatModel.CustomerChatList;


async function getSingleCustomerChat(id){
    return await CustomerChat.findAll({
        where:{
            [db.sequelize.or]:[
                {
                    sender_id_id:id
                },
                {
                    receiver_id:id
                }
            ]
        },
        raw:true
    })
}



async function insertCustomerChat(sender_id,receiver_id,message,imageUrl){

    return await CustomerChat.create({
        sender_id:sender_id,
        receiver_id:receiver_id,
        message:message,
        imageUrl:imageUrl,
    })

}

async function findOrCreateCustomerChatList(user_id){
    return await CustomerChatList.findOrCreate({
        where:{user_id:user_id}
    })
}


async function getCustomerChatList(){
    return await CustomerChatList.findAll({raw:true});
}

 module.exports = {insertCustomerChat,findOrCreateCustomerChatList,getCustomerChatList,getSingleCustomerChat};


