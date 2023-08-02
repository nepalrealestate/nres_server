const bcrypt = require('bcrypt');

const {login} = require("./commonAuthCode");
const { registerSuperAdmin,findSuperAdmin } = require('../../models/users/model.superAdmin');

const saltRound = 10;

const handleGetSuperAdmin = async(req,res)=>{
    console.log("Get Super Admin Api Hit Hard!!")
    return res.status(200).json({message:"Very Soon Getting Super Admin Data Data"});
}

const handleSuperAdminRegistration = async(req,res)=>{
    

    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

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

    return login(req,res,superAdmin);

}

module.exports = {handleGetSuperAdmin,handleSuperAdminRegistration,handleSuperAdminLogin}