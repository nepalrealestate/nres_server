const bcrypt = require('bcrypt');
const {connection}  = require('../../connection');
const {createBuyer,findBuyer} = require("../../models/users/buyer")
const jwt = require("jsonwebtoken");
const {login} = require('./commonAuthCode')

const saltRound  = 10;

const tokenExpireTime = '1hr';



const handleRegistration = async function(req,res){
    console.log("Buyers Registration Successfulllll");
    
    
    const {name:name,email:email,password:password,confirmPassword:confirmPassword} = req.body

    //validate  password

    if (password !== confirmPassword) {
        console.log("Password not match  ");
        return res.status(403).json({ message: "Password  not match" });
      }
    try {

        
        const hashPassword  = await bcrypt.hash(password,saltRound);
        //store details in DB
        const result = await createBuyer(name,email,hashPassword);
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


const handleLogin = async function (req,res){

    const {email} = req.body;
  
    //find buyer userName in DB

    const buyer =  await findBuyer(email);
    console.log(buyer);

    //this login function handle all logic

    return login(req,res,buyer);

}



async function handleBuyers (req,res){

    console.log(req.body);
    console.log("Buyer Api Hitt!!!!")

    return res.status(200)
}





module.exports ={handleBuyers,handleRegistration,handleLogin}