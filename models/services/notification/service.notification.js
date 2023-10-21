const db = require("../../model.index");
const NotifyAdmin = db.NotificationModel.NotifyAdmin;


async function insertNotification(data){ 
    console.log(data)
    return  NotifyAdmin.create({
            user_id:data.user_id,
            user_type:data.user_type,
            notification:data.notification,
            url:data.url
    })
    
}

async function updateNotificationSeen(id){
    return await NotifyAdmin.update({seen:true},{
        where:{id:id}
    })
}


async function getNotification(limit,offset){
    return await NotifyAdmin.findAll({
        limit:limit,
        offset:offset,
        order:[['createdAt','DESC']]
    })
}

async function getNotificationCount(){
    return await NotifyAdmin.count({where:{seen:false}})
}


module.exports  = {insertNotification,updateNotificationSeen,getNotification,getNotificationCount};


