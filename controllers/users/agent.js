const bcrypt = require('bcrypt');
const {registerAgent,findAgent}  = require("../../models/users/agent");
const jwt = require("jsonwebtoken");
const {login} = require('./commonAuthCode')

const saltRound  = 10;

const tokenExpireTime = '1hr';
const handleGetAgent = async (req,res)=>{
    console.log("Get Agent Api Hit");
    
    return res.status(200).json({message:"Successfully getting data....."})
}


const handleRegistration = async(req,res)=>{
    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        
        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await registerAgent(name,email,hashPassword);
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

const handleLogin  = async (req,res)=>{
    const {email} = req.body;
  
    //find buyer userName in DB

    const agent =  await findAgent(email);
    console.log(agent);

    //this login function handle all logic

    return login(req,res,agent);

}



module.exports = {handleRegistration,handleGetAgent,handleLogin};