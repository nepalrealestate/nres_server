
const db = require('../../model.index');
const AgentChat = db.ChatModel.AgentChatModel
const AgentChatList = db.ChatModel.AgentChatListModel
console.log("Loggin from agent chat")

async function getSingleAgentChat(id){
    return await AgentChat.findAll({
        where:{
            [db.sequelize.or]:[
                {sender_id:id},
                {receiver_id:id}
            ]
        },
        raw:true,
    })
}



async function insertAgentChat(sender_id,receiver_id,message){
    return await AgentChat.create({
        sender_id:sender_id,
        receiver_id:receiver_id,
        message:message
    })
}


async function insertAgentChatList(agent_id){
    return await AgentChatList.create({
        agent_id:agent_id
    })
}

async function getAgentChatList(){
    return await AgentChatList.findAll({raw:true});
}

module.exports = {getSingleAgentChat,insertAgentChat,insertAgentChatList,getAgentChatList}

