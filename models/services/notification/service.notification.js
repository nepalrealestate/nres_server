
db = require("../../model.index");
NotifyAdmin = db.NotificationModel.NotifyAdmin

async function insertNotification(data){
   
   
    
    
    
    return  NotifyAdmin.create({
            notification:data.notification,
            url:data.url
    })
    
}

module.exports  = {insertNotification};


