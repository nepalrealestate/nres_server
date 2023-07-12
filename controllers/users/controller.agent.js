const bcrypt = require("bcrypt");
const {
  registerAgent,
  findAgent,
  updateAgentPassword,
  getAgent,
  updateProfile,
  updateAgentProfile,
  findAgentPassword,
  getAllAgent,
} = require("../../models/users/model.agent");
const jwt = require("jsonwebtoken");
const {
  login,
  verifyToken,
  passwordReset,
  passwordUpdate,
} = require("./commonAuthCode");
const {
  getRandomNumber,
  convertArrayIntoJsonObject,
} = require("./controller.commonFunction");
const {
  deleteToken,
  findPasswordResetTokenValue,
  insertUsersRating,
} = require("../../models/users/model.commonUsersCode");
const { wrapAwait } = require("../../errorHandling");
const validator = require("email-validator");
const multer = require("multer");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");
const { Utility,Auth } = require("../controller.utils");
const { query } = require("express");

const utility = new Utility();
const auth = new Auth();

const saltRound = 10;

const tokenExpireTime = "1hr";


const imagePath = "uploads/users/agent/images";
const maxSixe = 2 * 1024 * 1024;
const {upload} = new UploadImage(imagePath, maxSixe);





const handleGetAgent = async (req, res) => {
  console.log("Get Agent Api Hit");
  //const {agent_ID} = req.params;
  console.log(req.id)
  const agent_ID = req.id;

  if (!agent_ID) {
    return res.status(400).json({ message: "plase provide agent id" })
  }

  try {
    const data = await getAgent(agent_ID);
    console.log(data);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: error });
  }


};


const handleAgentRegistration = async (req, res) => {


  upload.single('identification_image')(req,res,async function(err){
    utility.handleMulterError(req,res,err,registration,true)
   
  })

  async function registration(){
  

    const {name,email,phone_number,identification_type,identification_number,password,confirm_password} = req.body;
    const image = JSON.stringify({"identification":req.file.path});

    const isEmailValid = await  utility.isValid.email(email);
    const isPhoneNumberValid =await  utility.isValid.phoneNumber(phone_number);
    const isPasswordValid =await  utility.isValid.password(password,confirm_password)

    if(!name || !identification_type || !identification_number){
      return res.status(400).json({message:"field missing"})
    }
    if( ! isEmailValid ) {
      return res.status(400).json({message:"Invalid Email"});   
    }
    if( ! isPhoneNumberValid){
      return res.status(400).json({message:"Invalid Phone Number"});   
    }
    if( ! isPasswordValid ){
      return res.status(400).json({message:"Invalid Password"});
    }

  
    const [hashPassword, hashPasswordError] = await wrapAwait(
      bcrypt.hash(password, saltRound)
    );
    if (hashPasswordError) {
      console.log(hashPasswordError);
      return res.status(500).json({ message: "Something happen" });
    }
  
  
   const values = [name,email,phone_number,identification_type,identification_number,image,hashPassword];

   utility.handleRegistration(res,registerAgent,values);

   

   
  }
}





const handleAgentLogin = async (req, res) => {
  const { email } = req.body;

  //find buyer userName in DB

  const agent = await findAgent(email);
  console.log(agent);

  //this login function handle all logic

  return auth.login(req, res, agent);
};

// Verify Token

const handleAgentVerifyToken = async (req, res, next) => {
  return auth.verifyToken(req, res, next);
};

// Password Reset Function

const handleAgentPasswordReset = async (req, res, next) => {
  // recive email in parameter

  // if we recieve only email then reset password
  // if we recieve token email and password (in body)
  // after update password - delete token in database

  const { email, token } = req.query;

  // if email field empty
  if (!email) {
    return res.status(400).json({ message: "Please Enter Email" });
  }

  const [agent, agentError] = await wrapAwait(findAgent(email));
  if (email && token && agent) {
   
    // pass update Password function as parameters;
    return await auth.passwordUpdate(req, res, agent, updateAgentPassword);
  }
  // if there is no token - then get token for reset password
  return await auth.passwordReset(req, res, agent);
};

//this function will shift to user routing
const handleAgentRating = async (req, res) => {

  const { agent_id, rating } = req.body;
  if (!agent_id || !rating) {
    return res.status(400).json({ message: "please provide agent id and rating" })
  }

  try {
    await insertUsersRating(agent_id, rating);
    return res.status(200).json({ message: "Rating submitted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }

}


const handleUpdateAgentProfile  = async (req,res)=>{


  upload.single('profile_image')(req,res,(err)=>utility.handleMulterError(req,res,err,updateProfile))

 async function updateProfile(){
    const agent_id = req.id;

  const validField = ['name','email','phone_number'];

  let profileImage =req?.file?req?.file?.path:null;
  

  if(!req.query){
    return res.status(400).json({message:"Empty Input"})
  }
  for (const key in req.query){
    if(!validField.includes(key)){
      return res.status(400).json({message:`${key} cannot update`})
    }
  }

  //add image in req.query
  const updateData = {
    ...req.query,
    profile: profileImage
  };
  console.log(updateData);
  try {
    const [response,field] = await updateAgentProfile(agent_id,updateData);
    return res.status(200).json({message:"Succesfully Update"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:"Unable to update"});
  }


  }
  

}


const handleUpdateAgentPassword = async(req,res)=>{
  const agent_id = req.id;
  const oldPassword = req.body.old_password;

 const [{password},passwordError] = await wrapAwait(findAgentPassword(agent_id));

 if(passwordError){
  return res.status(404).json({message:"No User Found"})
 }
  console.log( password)
 const isPasswordMatch = await bcrypt.compare(oldPassword,password);
 if(!isPasswordMatch){
  return res.status(400).json({message:"Password does not match"})
 }

 return auth.updateProfilePassword(req,res,updateAgentPassword);

 
 


}


const handleGetAllAgent = async (req,res)=>{

  return utility.getSearchData(req,res,getAllAgent)

}

module.exports = {
  handleAgentRegistration,
  handleGetAgent,
  handleAgentLogin,
  handleAgentVerifyToken,
  handleAgentPasswordReset,
  handleAgentRating,
  handleUpdateAgentProfile,
  handleUpdateAgentPassword,
  handleGetAllAgent
};
