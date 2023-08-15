const events = require("events");
const { insertNotification } = require("../../models/services/notification/service.notification");

const notificationEmitter = new  events.EventEmitter();

const pushNotification = async function(data){

    try {
        insertNotification(data).then(()=>{
        console.log("Insert Notification")
        }).catch((err)=>{console.log("Error while insertion",err)});
        
        notificationEmitter.emit("pushNotification",data);
      
    } catch (error) {
       console.log(error);
    }

}

const handleNotification = async function (notification,socket){

    notificationEmitter.on("pushNotification",handlePushNotification)

    function handlePushNotification(data){
        console.log(data);
        // store notification

        notification.emit("pushNotification",data);
    }

   // notification.emit("pushNotification","sending notification from backend");


}

// insert this statement whenever needed - 
//notificationEmitter.emit("pushNotification",{message:`${user_type} Login Successfully`})


module.exports = {handleNotification ,notificationEmitter,pushNotification}