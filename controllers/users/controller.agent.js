const bcrypt = require("bcrypt");
const db = require("../../models/model.index")

const { wrapAwait } = require("../../errorHandling");

const multer = require("multer");
const { UploadImage } = require("../../middlewares/middleware.uploadFile");

const { query } = require("express");
const {
  registerAgent,
  findAgent,
  getAllAgent,
  updateAgentProfile,
  getAgent,
  findAgentPassword,
  
  insertAgentRating,
  getAgentByID,
} = require("../../models/services/users/service.agent");
const utility = require("../controller.utils");
const { getUser, registerUser, findUserByEmail, findUserByID, updateAgentPassword, createAgentProfile } = require("../../models/services/users/service.user");
const { countListingProperty } = require("../../models/services/property/service.property");
const { uploadOnCloudinary, uploadMultipleOnCloudinary } = require("../../utils/cloudinary");

const saltRound = 10;
const tokenExpireTime = "7d";
const JWT_KEY = process.env.JWT_KEY_AGENT;
const auth = utility.authUtility(tokenExpireTime, saltRound, JWT_KEY, "agent");
const user = utility.userUtility("agent");

const utils = utility.utility();

const imagePath = "uploads/users/agent/images";
const maxSize = 2 * 1024 * 1024;
const  upload  = new UploadImage(imagePath, maxSize);

const handleGetAgent = async (req, res) => {

  if (req.id && req.user_type === "agent") {
    agent_id = req.id;
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const [agent,propertyCount] = await Promise.all([
      findUserByID("agent", agent_id,['name','email','phone_number']),
      countListingProperty({owner_id:agent_id})
    ])
    const response = {
      agent,
      propertyCount
    }
    return res.status(200).json(response);
  } catch (error) {
    utility.handleErrorResponse(res,error)
  }
};

const handleGetAgentIsLoggedIn = async (req, res) => {
  const agent_id = req.id;
  try {
    const agent = await getAgentByID(agent_id);
    return res.status(200).json({ data:agent,message: "Agent Logged In", agent: agent });
  } catch (error) {
    utility.handleErrorResponse(res,error)
  }
}

const handleAgentRegistration = async (req, res) => {
  /**
   * First image for profile image
   * second image for identification image
   */

  const { name, email, phone_number, password, identification_type,identification_number,province,district,municipality,ward_number,area_name } = req.body;
  console.log(req.body)
  console.log(req.files)
  const identification_image = req?.files[1]?.path;
  const profile_image = req?.files[0]?.path;
  if(!identification_image || !profile_image){
    return res.status(400).json({message:"Please provide identification image"})
  }
  
  if (!name || !email || !phone_number || !password ) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const isEmailValid = utils.isValid.email(email);
  const isPhoneNumberValid = utils.isValid.phoneNumber(phone_number);

  if (!isEmailValid || !isPhoneNumberValid) {
    return res.status(400).json({ message: "invalid input" });
  }

  const [hashPassword, hashPasswordError] = await wrapAwait(
    bcrypt.hash(password, saltRound)
  );
  if (hashPasswordError) {
    console.log(hashPasswordError);
    return res.status(500).json({ message: "Something happen" });
  }
  //transaction
  const transaction = await db.sequelize.transaction();
 
  try {
    const agentAccountResponse = await db.UserModel.User.create({
      user_type:"agent",
      name: name,
      email: email,
      phone_number: phone_number,
      password: hashPassword,
    }
    ,{
      transaction:transaction
    })

    const agent_id = agentAccountResponse.toJSON().user_id;


    const agentProfileResponse= await db.UserModel.AgentProfile.create({
      user_id:agent_id,
      identification_type,
      identification_number,
      identification_image:null,
      profile_image:null,
      province,
      district,
      municipality,
      ward_number,
      area_name,
    },{
      transaction:transaction
    })

    if(identification_image){
     
      uploadMultipleOnCloudinary([identification_image,profile_image],`user/agent/${agentAccountResponse.toJSON().user_id}-${name}`).then(async (response)=>{
        console.log(response)
        agentProfileResponse.profile_image = response['0'];
        agentProfileResponse.identification_image = response['1']
        
        console.log(agentProfileResponse.toJSON())
        await agentProfileResponse.save();
        await transaction.commit();
      })
    }  
    return res.status(200).json({ message: "Agent Registration success" })
  } catch (error) {
    transaction.rollback()
    utility.handleErrorResponse(res,error)
  }
}

const handleAgentLogin = async (req, res) => {
  const { email } = req.body;
  try {
    let agent = null;
    if(req.loginType === "google"){
       agent = await findUserByEmail("agent",email);
      if(!agent){
        return res.status(404).json({message:"No Agent Found"});
      }
      return auth.login(req, res, agent.dataValues);
    }
    agent = await findUserByEmail("agent",email);
    if (!agent && req.loginType !== "google") {
      return res.status(404).json({ message: "No Agent Found" });
    }


    return auth.login(req, res, agent.dataValues);
  } catch (error) {
    utility.handleErrorResponse(res,error)
  }
};

// Verify Token

const handleAgentVerifyToken = async (req, res, next) => {
  return auth.verifyToken(req, res, next);
};

// Password Reset Function

const handleAgentPasswordReset = async (req, res, next) => {

  const { email, token } = req.query;

  // if email field emptyempty
  if (!email) {
    return res.status(400).json({ message: "Please Enter Email" });
  }
  try {
    const agentResponse = await findUserByEmail("agent",email);
    
    if(!agentResponse){
      return res.status(400).json({message:"No Agent Found"});
    }
    if(email && !token){
        // if there is no token - then get token for reset password
      return await user.forgetPassword(req, res, agentResponse.dataValues);
    }
    if(email && token){
       // pass update Password function as parameters;
      return await user.passwordUpdate(req, res, agentResponse.dataValues,updateAgentPassword);
    }

  } catch (error) {
    utility.handleErrorResponse(res,error)
  }
};

//this function will shift to user routing
const handleAgentRating = async (req, res) => {
  const { agent_id, rating } = req.body;
  if (!agent_id || !rating) {
    return res
      .status(400)
      .json({ message: "please provide agent id and rating" });
  }

  try {
    await insertAgentRating(agent_id, rating);
    return res.status(200).json({ message: "Rating submitted" });
  } catch (error) {
    utility.handleErrorResponse(res,error)
  }
};

const handleUpdateAgentProfile = async (req, res) => {
  upload.single("profile_image")(req, res, (err) =>
    utils.handleMulterError(req, res, err, updateProfile)
  );

  async function updateProfile() {
    const agent_id = req.id;
    console.log("THIS IS AGENT ID ", req.id);

    const validField = ["name", "email", "phone_number"];

    let profileImage = req?.file ? req?.file?.path : null;

    if (!req.query) {
      return res.status(400).json({ message: "Empty Input" });
    }
    for (const key in req.query) {
      if (!validField.includes(key)) {
        return res.status(400).json({ message: `${key} cannot update` });
      }
    }

    //add image in req.query
    const updateData = {
      ...req.query,
      profile: profileImage,
    };
    console.log(updateData);
    try {
      const [response, field] = await updateAgentProfile(agent_id, updateData);
      return res.status(200).json({ message: "Succesfully Update" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Unable to update" });
    }
  }
};


const handleUpdateAgentPassword = async (req, res) => {
  const agent_id = req.id;
  const oldPassword = req.body.old_password;

  const [{ password }, passwordError] = await wrapAwait(
    findAgentPassword(agent_id)
  );

  if (passwordError) {
    return res.status(404).json({ message: "No User Found" });
  }
  console.log(password);
  const isPasswordMatch = await bcrypt.compare(oldPassword, password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Password does not match" });
  }

  return user.updateProfilePassword(req, res, updateAgentPassword);
};

const handleGetAllAgent = async (req, res) => {
  return utils.getSearchData(req, res, getAllAgent);
};

const handleInsertAgentRating = async (req, res) => {
  //this request comes from customer router;
  const { rating, review, agent_id } = req.body;
  const customer_id = req.id;

  try {
    await insertAgentRating(rating, review, customer_id, agent_id);
    return res.status(200).json({ message: "Insert Ratings" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Error" });
  }
};

const agentVerifyToken = async (req, res, next) => {
  auth.verifyToken(req, res, next);
};

module.exports = {
  handleAgentRegistration,
  handleGetAgent,
  handleAgentLogin,
  handleAgentVerifyToken,
  handleAgentPasswordReset,
  handleAgentRating,
  handleUpdateAgentProfile,
  handleUpdateAgentPassword,
  handleGetAllAgent,
  handleInsertAgentRating,
  agentVerifyToken,
  handleGetAgentIsLoggedIn
};
