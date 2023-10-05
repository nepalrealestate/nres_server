
const db = require("../../model.index");
const CustomerChat = db.ChatModel.CustomerChat;
const CustomerChatList = db.ChatModel.CustomerChatList;


async function getSingleCustomerChat(id){
    return await CustomerChat.findAll({
        where:{
            [db.Op.or]:[
                {
                    sender_id:id
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


//this function only for admin
async function getCustomerChatList(limit,offset){
    return await CustomerChatList.findAll({
        include:[
            {
                model:db.UserModel.User,
                as:'customer',
                attributes:['name'],


            },
            // {
            //     model:db.ChatModel.CustomerChat,
            //     as:'chat_customers',
            //     limit:1,//only get latest chat
            //     where:{
            //         user_id:{
            //             [db.Op.ne]:0//sender_id should not admin
            //         }
            //     },
            //     attributes:['message'],
            //     order: [['createdAt', 'DESC']]  
                
            // }
        ],
        limit:limit,
        offset:offset,
        attributes:{
            exclude:['createdAt','updatedAt']
        }
    });
}

 module.exports = {insertCustomerChat,findOrCreateCustomerChatList,getCustomerChatList,getSingleCustomerChat};


