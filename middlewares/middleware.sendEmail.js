// send all email to users;
const nodemailer = require("nodemailer");
const logger = require("../utils/errorLogging/logger");


const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;  // 5 seconds

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
 service:"gmail",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});


  // send password reset token to user
  
  async function sendPasswordResetTokenMail(userEmail, token, retries = 0) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await transporter.sendMail({
          from: process.env.EMAIL,
          to: userEmail,
          subject: "Reset Password OTP  ✔",
          text: `Your Reset Password OTP is : ${token} please use before it expires .`
        });
  
        console.log(data);
        resolve(data);
      } catch (error) {
        console.log(error);
        if (error.code === 'ETIMEDOUT' && retries < MAX_RETRIES) {
          console.log(`Retry attempt ${retries + 1} after connection timeout...`);
          setTimeout(() => {
            sendPasswordResetTokenMail(userEmail, token, retries + 1)
              .then(resolve)
              .catch(reject);
          }, RETRY_DELAY);
        } else {
          reject(error);
        }
      }
    });
  }

    async function sendPasswordEmail(email,password){
      return new Promise((resolve,reject)=>{
        transporter.sendMail({
          from:process.env.EMAIL,
          to:email,
          subject:"Your NRES Login Password",
          text:`Your Password is ${password} . Please Change `,
        }).then((data)=>{
          console.log("Email sent",data)
          logger.info(`Password email sent to ${email}`);
          resolve(data);
        }).catch(function(err){
          logger.error(`Error while sending password email - ${err}`)
          reject(err)
        })
      })
    }

  //  const info =  await transporter.sendMail({

       

  //   }).catch((error)=>console.log(error))

  //   console.log(info);
  


 module.exports = {sendPasswordResetTokenMail,sendPasswordEmail};