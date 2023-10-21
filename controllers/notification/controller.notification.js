const { getNotification, getNotificationCount, updateNotificationSeen } = require("../../models/services/notification/service.notification")
const { findAdminByID } = require("../../models/services/users/service.admin")
const { findUserByID } = require("../../models/services/users/service.user")
const { handleLimitOffset, handleErrorResponse } = require("../controller.utils")



const handleGetNotification = async function(req,res){

    const [limit,offset] = handleLimitOffset(req)

    const getUser = {
        customer: findUserByID,
        agent: findUserByID,
        staff: findAdminByID,
        superAdmin:findAdminByID
    }
   
    try {
        const [notification,notificationCount] = await Promise.all([
            getNotification(limit,offset),
            getNotificationCount(),
        ])
      
        const userTypeFunction = getUser[notification[0]?.dataValues?.user_type];

        if (typeof userTypeFunction !== "function") {
            // Handle the error: maybe send a response or throw an error
            return res.status(400).json({ error: "Invalid user type" });
        }
        
        const user = await userTypeFunction(notification[0]?.dataValues?.user_id, ['name']);
        
        const response = {
            notification,
            notificationCount,
            user
        }
        return res.status(200).json(response);
    } catch (error) {
        handleErrorResponse(res,error)
    }

}

const handleUpdateNotificationSeen = async function(req,res){
    const {notificationID} = req.params;
    try {
        const response = await updateNotificationSeen(notificationID);
        console.log(response)
        if(!response[0]) return res.status(400).json({message:"Notification not found"})
        return res.status(200).json({message:"Notification seen updated"});
    } catch (error) {
        handleErrorResponse(res,error);
    }
}



module.exports = {handleGetNotification,handleUpdateNotificationSeen}