const bcrypt = require('bcrypt');

const { registerSuperAdmin, findSuperAdmin } = require('../../models/services/users/service.superAdmin');

const  utility = require("../controller.utils");


const saltRound = 10;
const tokenExpireTime = "1hr";
const JWT_KEY = process.env.JWT_KEY_AGENT
const auth = utility.authUtility(tokenExpireTime,saltRound,JWT_KEY,"superAdmin");

const handleGetSuperAdmin = async(req,res)=>{
    console.log("Get Super Admin Api Hit Hard!!")
    return res.status(200).json({message:"Very Soon Getting Super Admin Data Data"});
}

const handleSuperAdminRegistration = async(req,res)=>{
    

    const {name,email,password,confirmPassword} = req.body

    //validate  password
    console.log(password);
    console.log(confirmPassword)

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        
        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await registerSuperAdmin(name,email,hashPassword);
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

const handleSuperAdminLogin = async(req,res)=>{

    const {email} = req.body;
  
    //find superAdmin userName in DB

    const superAdmin =  await findSuperAdmin(email);
    console.log(superAdmin);

    //this login function handle all logic

    return auth.login(req,res,superAdmin);

}

const superAdminVerifyToken = async (req,res,next)=>{

    auth.verifyToken(req,res,next);

}

module.exports = {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin,superAdminVerifyToken}