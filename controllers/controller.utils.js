
const multer = require('multer')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ModelUtility = require('../models/model.utils');
const { sendPasswordResetTokenMail } = require('../middlewares/middleware.sendEmail');
const { wrapAwait } = require("../../errorHandling");
const modelUtils = new ModelUtility();

function Utility(){
    //variables
    const numberRegex = /(\+977)?[9][6-9]\d{8}/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    



   this.getSearchData = async function (req,res,getDataFunction){
    let page, limit, offSet;

    // if page and limit not set then defualt is 1 and 20 .
    page = req.query.page || 1;
  
    limit = req.query.limit < 20 ? req.query.limit : 20 || 20;
    // if page and limit present in query then delete it
    if (req.query.page) delete req.query.page;
  
    if (req.query.limit) delete req.query.limit;
  
    offSet = (page - 1) * limit;

    try {
        const data = await getDataFunction(req.query, limit, offSet);
        console.log(data);
    
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ message: error.sqlMessage });
      }


   }

   this.isValid={
   
    phoneNumber:async function (phoneNumber){
        return phoneNumber.match(numberRegex);
    },

    email:async function (email){
            return email.match(emailRegex);
    }

   }

   this.getRandomNumber = function (minValue,maxValue){
    return Math.floor(Math.random()*(maxValue-minValue)+minValue);
   }

}




function Auth(){

  const tokenExpireTime = '1hr';
  const saltRound = 10;



  this.login = async function (req,res,user){


    const { password } = req.body;
    if (!user) {
      console.log("No User Found");
      return res.status(404).send("User Not Found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password doesnot match" });
    }
  
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: tokenExpireTime,
    });

    let checkCookie = req.headers.cookie;
    if (req.cookies[`${user.id}`]) {
      console.log("THe cookies from insdie")
      console.log(req.cookies[`${user.id}`])
      req.cookies[`${user.id}`] = ""; // set null if already present 
      //res.clearCookie(`${user.id}`,{path: "/"});// if already set on response 
     
    }
  
    // //if there are two or more than different users login cookies then remove it from loop
    // not fully optimized solution
    if (checkCookie) {
      let cookieArray = req.headers.cookie.split(";");
      console.log(cookieArray);
      cookieArray.forEach((cookie) => {
        let key = cookie.trim().split("=")[0];
        if (req.cookies[`${key}`]) {
          //if user cookie already present then remove it
          console.log("This cookie already present", key);
          //req.cookies[`${key}`]="";
          res.clearCookie(`${key}`, { path: "/" });
          return;
        }
      });
    }
  
    
    res.cookie(String(user.id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 1000 * 60),
      httpOnly: true,
      sameSite: "lax",
    });
  

    return res.status(200).json({ message: "Successfully Logged In", token });
  },




  this.verifyToken = async function (req,res,next){

    const cookies = req.headers.cookie;
    console.log(req.cookies);
    console.log("THIS IS COOKIES",req.headers.cookie);
    if (!cookies) {
      console.log("No cookies Bro !!!!!!!");
      return res.status(404).json({ message: "Cannot get information" });
    }
  
    const token = cookies.split("=")[1];
    console.log(token);
    if (!token) {
      return res.status(404).json({ message: "No Token found" });
    }
    jwt.verify(String(token), process.env.JWT_KEY, (err, user) => {
      if (err) {
        console.log(err)
        return res.status(400).json({ message: "Invalid Token" });
      }
  
      console.log(user.id);
      //set request id
      req.id = user?.id;
      console.log("Token Verify  !!!");
     next();
    });

  },


  this.refreshToken = async (req,res,next)=>{
    const cookies = req.headers.cookie;
    let prevToken;
    if (typeof cookies === "string") {
      prevToken = cookies.split("=")[1]; //slipt headers from token
    }
  
    if (!prevToken) {
      return res.status(400).json({ message: "No Token found" });
    }
  
    jwt.verify(String(prevToken), process.env.JWT_KEY, (err, decode) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ message: "Authentication Failed" });
      }
  
      //clear cookies from response
      res.clearCookie(`${decode.id}`);
      //clear cookies from headers
      req.cookies[`${decode.id}`] = "";
  
      //generate new token
      const newToken = jwt.sign({ id: decode.id }, process.env.JWT_KEY, {
        expiresIn: tokenExpireTime,
      });
  
      //set new Token to cookie
      res.cookie(String(decode.id), newToken, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 1000 * 60),
        httpOnly: true,
        sameSite: "lax",
      });
  
      //set request id to user id
      req.id = decode.id;
      console.log("Refresh TOken Successfull  ");
      next();
    });
  },



  this.passwordReset = async function (req,res,user){
    if (!user) {
      return res.status(401).json({ message: "User Not Found!" });
    }
  
    const randomToken = getRandomNumber(1000,9999);
  
    const [resultToken, errorToken] = await wrapAwait(
      modelUtils.insertPasswordResetToken(user.id, randomToken)
    );
    // if we get error of duplicate entry then update token value
  
    let isTokenUpdate = false;
  
    if (errorToken) {
      console.log(errorToken);
      if (errorToken.code === "ER_DUP_ENTRY") {// if duplicate entry the udpate token value
        const [resultUpdateToken, errorUpdateToken] = await wrapAwait(
          modelUtils.updatePasswordToken(user.id, randomToken)
        );
        if (errorUpdateToken) {
          return res.status(500).json({ message: error.sqlMessage });
        }
        isTokenUpdate = true;
        console.log(isTokenUpdate);
      } else {
        console.log(errorToken);
        return res.status(500).json({ message: "server Error " });
      }
    }
    // if token insert in db or updated in db then send mail
    if (resultToken || isTokenUpdate) {
      sendPasswordResetTokenMail(user.email, randomToken)
        .then(function (data) {
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  
    return res
      .status(200)
      .json({ message: "Token re-generate sucessfully Check Your Email " });
  }




  this.passwordUpdate = async function (req,res,user,updateUserPassword){

    if (!user) {
      return res.status(401).json({ message: "User Not Found!" });
    }
  
    const { email, token } = req.query;
  
    // if email field empty
    if (!email) {
      return res.status(401).json({ message: "Please Enter Email" });
    }
  
    if (email && token && user) {
      // logic for update password
      const { password, confirmPassword } = req.body;
      // if password doesnot match
      if (password !== confirmPassword) {
        console.log(" New Password not match  ");
        return res.status(403).json({ message: " New Password  not match" });
      }
  
      const [storeToken, storeTokenError] = await wrapAwait(
        modelUtils.findPasswordResetToken(user.id)
      );
  
      console.log(storeToken);
  
      // check expire date
  
      const expireDate = new Date(storeToken.expirationTime);
      const currentDate = new Date();
      const expireDay = expireDate.getUTCDate();
      const currentDay = currentDate.getUTCDate();
  
      if (storeToken.token !== token || storeTokenError) {
        return res.status(401).json({ message: "No Token Match" });
      }
  
      //if token expire
      if (Number(currentDay) >= Number(expireDay)) {
        return res
          .status(401)
          .json({ message: "Token Expire ! please generate New Token" });
      }
  
      const [hashPassword, hashPasswordError] = await wrapAwait(
        bcrypt.hash(password, saltRound)
      );
  
      if (hashPassword) {
        // this updateUser password return result in array in form of resolve and reject
        const [passwordUpdate, passwordUpdateError] = await updateUserPassword(
          user.id,
          hashPassword
        );
        if (passwordUpdate) {
          modelUtils.deleteToken(user.id).then(function () {
            console.log("token delete Successfully");
          });
          return res.status(200).json({ message: "Password Update succesfuly" });
        }
  
        if (passwordUpdateError) {
          console.log("password Update Error");
          return res.status(500).json({ message: "Password doesnot update" });
        }
      }
  
      return res.status(500).json({ message: "couldn't update password" });

  }


}

}


module.exports = {Utility,Auth}