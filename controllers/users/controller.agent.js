const bcrypt = require("bcrypt");
const {
  registerAgent,
  findAgent,
  updateAgentPassword,
  getAgent,
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

const saltRound = 10;

const tokenExpireTime = "1hr";


const imagePath  = "uploads/users/agent/images";
const maxSixe = 2*1024*1024;
const upload = new UploadImage(imagePath,maxSixe).upload.array('image',2);




const handleGetAgent = async (req, res) => {
  console.log("Get Agent Api Hit");
  //const {agent_ID} = req.params;
  console.log(req.id)
  const agent_ID = req.id;

  if(!agent_ID){
    return res.status(400).json({message:"plase provide agent id"})
  }

  try {
    const result = await getAgent(agent_ID);

    return res.status(200).json({ message: result});
  } catch (error) {
    return res.status(400).json({message:error});
  }

  
};


const handleAgentRegistration = async (req, res) => {


  upload(req, res,async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({message:"Error while uploading",err})
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({message:"Error while uploading",err})
    }

    // Everything went fine.

    const agentData = { ...req.body };
    console.log(agentData);
  
    console.log("After Image Upload", req.files);
  
    const images = req.files;
  
    agentData.identificationImage = images.reduce(
      (acc, value, index) => ({ ...acc, [index]: value.path }),
      {}
    );
    agentData.identificationImage = JSON.stringify(
      agentData.identificationImage
    );
  
    console.log(agentData);
  
    if (
      !agentData?.fullName ||
      !agentData?.identificationNumber ||
      !agentData?.termsAndCondition ||
      !agentData?.identificationType
    ) {
      return res.status(400).json({ message: "field missing" });
    }
  
    //validate email and phone number
    const numberRegex = /(\+977)?[9][6-9]\d{8}/;
    if (
      !validator.validate(agentData?.email) ||
      !agentData?.phoneNumber.match(numberRegex)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid Email Address Or phone Number" });
    }
  
    //validate  password
    if (agentData?.password !== agentData?.confirmPassword) {
      console.log("Password not match  ");
      return res.status(403).json({ message: "Password  not match" });
    }
  
    const [hashPassword, hashPasswordError] = await wrapAwait(
      bcrypt.hash(agentData.password, saltRound)
    );
    if (hashPasswordError) {
      console.log(hashPasswordError);
      return res.status(400).json({ message: "Something happen" });
    }
    delete agentData.confirmPassword;
    agentData.password = hashPassword;
  
    const [response, responseError] = await wrapAwait(registerAgent(agentData));
  
    if (responseError) {
      if (responseError.errno === 1062) {
        return res.status(400).json({ message: "Agent Already Register" });
      }
      return res.status(400).json({ message: responseError });
    }
    return res.status(200).json({ message: "Registration successfully" });
 }
  )



};

const handleAgentLogin = async (req, res) => {
  const { email } = req.body;

  //find buyer userName in DB

  const agent = await findAgent(email);
  console.log(agent);

  //this login function handle all logic

  return login(req, res, agent);
};

// Verify Token

const handleAgentVerifyToken = async (req, res, next) => {
  return verifyToken(req, res, next);
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
    return res.status(401).json({ message: "Please Enter Email" });
  }

  const [agent, agentError] = await wrapAwait(findAgent(email));
  if (email && token && agent) {
    async function updatePassword(id, hashPassword) {
      return await wrapAwait(updateAgentPassword(id, hashPassword));
    }
    // pass update Password function as parameters;
    return await passwordUpdate(req, res, agent, updatePassword);
  }
  // if there is no token - then get token for reset password
  return await passwordReset(req, res, agent);
};


const handleAgentRating = async (req,res)=>{

  const {agent_id,rating}  = req.body;
  if(!agent_id || !rating) {
    return res.status(400).json({message:"please provide agent id and rating"})
  }

  try {
    await insertUsersRating(agent_id,rating);
    return res.status(200).json({message:"Rating submitted"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:error});
  }

}

module.exports = {
  handleAgentRegistration,
  handleGetAgent,
  handleAgentLogin,
  handleAgentVerifyToken,
  handleAgentPasswordReset,
  handleAgentRating,
};
