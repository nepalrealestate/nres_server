
const db = require("../../model.index");
const StaffChat = db.ChatModel.StaffChat
const StaffChatList = db.ChatModel.StaffChatList
const StaffChatGroup = db.ChatModel.StaffChatGroup


async function getSingleStaffChat(id){

    return await StaffChat.findAll({
        where:{
            [db.sequelize.or]:[
                {sender_id:id},
                {receiver_id:id}
            ]
        },
        raw:true
    })

}

async function insertStaffChat(sender_id,receiver_id,message){
    return await StaffChat.create({
        sender_id:sender_id,
        receiver_id:receiver_id,
        message:message
    })
}


async function insertStaffChatList(staff_id){
    return await StaffChatList.create({
        staff_id:staff_id
    })
}

async function getStaffChatList(){
    return await StaffChatList.findAll({raw:true})
}


async function insertStaffGroup(staff_id){
    return await StaffChatGroup.create({
        staff_id:staff_id
    })
}

async function getStaffFromGroupById(staff_id){
    return await StaffChatGroup.findByPk(staff_id);
}


async function deleteStaffFromGroup(staff_id){
    return await StaffChatGroup.destroy({
        where:{
            staff_id:staff_id
        }
    })
}


async function insertStaffGroupChat(sender_id,message){
    return await StaffChatGroup.create({
        sender_id:sender_id,
        message:message
    })
}



module.exports = {getSingleStaffChat,insertStaffChat,insertStaffChatList,getStaffChatList,insertStaffGroup,getStaffFromGroupById,deleteStaffFromGroup,insertStaffGroupChat}