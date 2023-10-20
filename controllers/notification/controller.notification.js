const { handleLimitOffset } = require("../controller.utils")




const handleGetNotification = async function(req,res){

    const [limit,offset] = handleLimitOffset(req)
   
    try {
        const [notification,notificationCount] = await Promise.all([
            
            
        ])
    } catch (error) {
        
    }

}

const handleUpdateNotificationSeen = async function(req,res){

}



module.exports = {handleGetNotification,handleUpdateNotificationSeen}