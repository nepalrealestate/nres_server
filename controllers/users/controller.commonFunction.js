const { json } = require("body-parser");
const { sendPasswordResetTokenMail } = require("../../middlewares/property/middleware.sendEmail");
const { insertUsersRating } = require("../../models/users/model.commonUsersCode");



function getRandomNumber(){
    let maxValue = 9999;
    let minValue = 1000;
    return Math.floor(Math.random()*(maxValue-minValue)+minValue);

}

async function sendTokenToUserByEmail(email,token){

  return await sendPasswordResetTokenMail(email,token);

}








module.exports = {getRandomNumber,sendTokenToUserByEmail};