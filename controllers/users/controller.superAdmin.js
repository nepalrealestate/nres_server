const bcrypt = require('bcrypt');



const  utility = require("../controller.utils");
const { wrapAwait } = require('../../errorHandling');
const { registerAdmin, findAdmin } = require('../../models/services/users/service.admin');


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

    if(!name && !email && !password && ! confirmPassword){
        return res.status(400).json({message:"missing fields"});
    }

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await registerAdmin("superAdmin",name,email,hashPassword);
        if(result===undefined){
            return res.status(403).json({message:"Duplicate Email"});
        }
        console.log(result);

        return res.status(200).json({message:"Registration Succesfull"});
    } catch (error) {   
        utility.handleErrorResponse(res,error);
    }
   

}

const handleSuperAdminLogin = async(req,res)=>{

    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"missing field"})
    }
  
    //find superAdmin userName in DB
    try {
        const superAdmin = await findAdmin(email,"superAdmin");
        console.log(superAdmin)
        return auth.login(req,res,superAdmin);
    } catch (error) {
        utility.handleErrorResponse(res,error);
    }

    // const [superAdmin,superAdminError] =  await wrapAwait(findAdmin(email,"superAdmin"));
    // console.log(superAdmin);
    
    // if(superAdminError){
    //     utility.handleErrorResponse(res,superAdminError)
    // }
    // //this login function handle all logic

    // return auth.login(req,res,superAdmin);

}

const superAdminVerifyToken = async (req,res,next)=>{

    auth.verifyToken(req,res,next);

}

const superAdminVerifyLogin = async(req,res)=>{
    return res.status(200).json({message:"Admin Logged In",role:"superAdmin"});
}

module.exports = {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin,superAdminVerifyToken,superAdminVerifyLogin}