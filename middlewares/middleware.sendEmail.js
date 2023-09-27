// send all email to users;


const { error } = require("console");
const nodemailer = require("nodemailer");



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

  async function sendPasswordResetTokenMail(userEmail,token){

    return new Promise((resolve, reject) => {
      transporter.sendMail({
        from: 'test@nres.com', // sender address
        to: userEmail, // list of receivers
        subject: "Reset Password Token  ✔", // Subject line
        text: `Your Reset Password Token is : ${token} please use before it expires .`, // plain text body
      }).then(function(data){
        console.log(data);
        resolve(data);
      }).catch(function(error){
        console.log(error);
        reject(error);
      })
    })
  }


    async function sendPasswordEmail(email,password){
      return new Promise((resolve,reject)=>{
        transporter.sendMail({
          from:'test@nres.com',
          to:email,
          subject:"Your NRES Login Password",
          text:`Your Password is ${password} . Please Change `,
        }).then((data)=>{
          resolve(data);
        }).catch(function(err){
          reject(err)
        })
      })
    }

  //  const info =  await transporter.sendMail({

       

  //   }).catch((error)=>console.log(error))

  //   console.log(info);
  


 module.exports = {sendPasswordResetTokenMail,sendPasswordEmail};