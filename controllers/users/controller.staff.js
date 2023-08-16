
const bcrypt = require('bcrypt');
//const {registerStaff,findStaff, getStaffByID} = require("../../models/users/model.staff");

const { insertVideoLink } = require('../../models/property/model.property');
const { registerStaff, findStaff, getStaff, updateStaffPassword } = require('../../models/services/users/service.staff');
const { wrapAwait } = require('../../errorHandling');

const  utility = require("../controller.utils");


const saltRound = 10;
const tokenExpireTime = "1hr";
const JWT_KEY = process.env.JWT_KEY_AGENT
const auth = utility.authUtility(tokenExpireTime,saltRound,JWT_KEY,"staff");

const utils = utility.utility() ;
const user = utility.userUtility("staff");


const handleGetStaff = async function (req,res){
    console.log("Handling Staff");

    console.log(req.id);

    try {
        const data = await getStaff(req.id);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({message:error});
    }
    
 
}

const handleStaffRegistration = async(req,res)=>{

    if(req.body.googleTokenAccess){

        

    }else{
        const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body
    

        //validate  password
    
        if (password !== confirmPassword) {
            console.log("Password not match  ");
            return res.status(403).json({ message: "Password  not match" });
          }
        try {
    
            
            const hashPassword  = await bcrypt.hash(password,saltRound);
            //store details in DB
            const result = await registerStaff(name,email,hashPassword);
            if(result===undefined){
                return res.status(403).json({message:"Duplicate Email"});
            }
            console.log(result);
    
    
         
    
    
    
            return res.status(200).json({message:"Registration Succesfull"});
        } catch (error) {
            //handle hashing error\
            console.log(error);
           
            return res.status(404).json({message:"Email Already Register"});
        }
    }


   
}

const handleStaffLogin  = async(req,res)=>{

    const {email} = req.body;
  
    //find staff userName in DB
    console.log(email)
    const [staff,staffError] =  await wrapAwait(findStaff(email));
    console.log(staff);
    if(staffError){
        return res.status(500).json({message:"Internal Error"})
    }

    //this login function handle all logic

    return auth.login(req,res,staff);

}


const handleAddVideoLink = async (req,res)=>{
    const {property_type,videoLink} = req.body;

    

    

    if(!property_type || ! videoLink){
        return res.status(400).json({message:"Input field cannot be empty"});
    }

    const link = videoLink.split("=");
    const video_ID = link[1];
    try {
         await insertVideoLink(video_ID,property_type,videoLink);
         console.log("Video Upload succesfully")
        return res.status(200).json({message:"video link upload sucessfull"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.sqlMessage});
    }
}



const handleInsertStaffActivityLog = async function (req,res){

    

}


const handleStaffPasswordReset = async (req,res,next)=>{
    // recive email in parameter

  // if we recieve only email then reset password
  // if we recieve token email and password (in body)
  // after update password - delete token 

  const { email, token } = req.query;

  // if email field emptyempty
  if (!email) {
    return res.status(400).json({ message: "Please Enter Email" });
  }

  const [agent, agentError] = await wrapAwait(findStaff(email));
  if (email && token && agent) {
   
    // pass update Password function as parameters;
    return await user.passwordUpdate(req, res, agent,updateStaffPassword );
  }
  // if there is no token - then get token for reset password
  return await user.passwordReset(req, res, agent);
}




const staffVerifyToken = async (req,res,next)=>{
    auth.verifyToken(req,res,next);
}





module.exports={handleGetStaff,handleStaffRegistration,handleStaffLogin,handleAddVideoLink,handleStaffPasswordReset,staffVerifyToken}